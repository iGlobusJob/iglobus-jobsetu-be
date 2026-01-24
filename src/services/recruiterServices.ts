import recruiterModel from '../model/recruiterModel';
import bcrypt from 'bcrypt';
import jwtUtil from '../util/jwtUtil';
import jobsModel from '../model/jobsModel';
import clientModel from '../model/clientModel';
import candidateModel from '../model/candidateModel';
import IRecruiter from '../interfaces/recruiter';
import IClient from '../interfaces/client';
import ICandidate from '../interfaces/candidate';
import presignedUrlUtil from '../util/generatePresignedUrl';


const recruiterLogin = async (
  email: string,
  password: string
): Promise<{ recruiter: IRecruiter; token: string }> => {
  const recruiter = await recruiterModel
    .findOne({ email, isDeleted: false })
    .select('+password');

  if (!recruiter) {
    throw new Error('RECRUITER_NOT_FOUND');
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    recruiter.password
  );

  if (!isPasswordValid) {
    throw new Error('BAD_CREDENTIALS');
  }

  const token = jwtUtil.generateToken({
    recruiterId: recruiter.id,
    firstName: recruiter.firstName,
    lastName: recruiter.lastName,
    email: recruiter.email
  });

  return { recruiter, token };
};

const getAllJobsService = async () => {
  try {
    const jobs = await jobsModel.find().populate({
      path: 'clientId',
      select: 'organizationName primaryContact logo'
    });

    const alljobs = jobs.map(job => {
      const client = job.clientId as any;
      return {
        id: job.id,
        clientId: client?._id || job.clientId,
        organizationName: client?.organizationName || '',
        primaryContactFirstName: client?.primaryContact?.firstName || '',
        primaryContactLastName: client?.primaryContact?.lastName || '',
        logo: client?.logo || '',
        jobTitle: job.jobTitle,
        jobDescription: job.jobDescription,
        postStart: job.postStart,
        postEnd: job.postEnd,
        noOfPositions: job.noOfPositions,
        minimumSalary: job.minimumSalary,
        maximumSalary: job.maximumSalary,
        jobType: job.jobType,
        jobLocation: job.jobLocation,
        minimumExperience: job.minimumExperience,
        maximumExperience: job.maximumExperience,
        status: job.status,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt
      };
    });

    return {
      success: true,
      jobs: alljobs,
    };
  } catch (error) {
    throw new Error('RECRUITER_FETCH_JOBS_FAILED');
  }
};

const getJobByIdService = async (jobId: string) => {
  const job = await jobsModel.findById(jobId);
  return job;
};

const getAllClientsService = async () => {
  try {
    const clients = await clientModel.find({ status: 'active' });

    const formattedClients = clients.map(client => ({
      id: client.id,
      organizationName: client.organizationName,
      logo: client.logo,
      email: client.email,
      status: client.status,
      emailStatus: client.emailStatus,
      mobile: client.mobile,
      mobileStatus: client.mobileStatus,
      category: client.category,
      gstin: client.gstin,
      panCard: client.panCard,
      primaryContact: client.primaryContact,
      secondaryContact: client.secondaryContact,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    }));

    return {
      success: true,
      clients: formattedClients,
    };
  } catch (error) {
    throw new Error('CLIENTS_FETCH_ERROR_MESSAGE');
  }
};

const getClientByIdService = async (
  clientId: string
): Promise<IClient | null> => {
  return clientModel.findById(clientId);
};

const getAllCandidatesService = async () => {
  try {
    const candidates = await candidateModel.find();

    const formattedCandidates = await Promise.all(candidates.map(async candidate => {
      let profilePictureUrl: string | null = null;
      if (candidate.profilePicture) {
        profilePictureUrl = await presignedUrlUtil.generatePresignedUrl(candidate.profilePicture);
      }

      return {
        id: candidate.id,
        email: candidate.email,
        firstName: candidate.firstName || '',
        lastName: candidate.lastName || '',
        mobileNumber: candidate.mobileNumber || '',
        gender: candidate.gender || '',
        dateOfBirth: candidate.dateOfBirth || '',
        address: candidate.address || '',
        profilePicture: profilePictureUrl || '',
        category: candidate.category || '',
        designation: candidate.designation || '',
        experience: candidate.experience || '',
        createdAt: candidate.createdAt,
        updatedAt: candidate.updatedAt,
      };
    }));

    return {
      success: true,
      candidates: formattedCandidates,
    };
  } catch (error) {
    throw new Error('CANDIDATE_FETCH_FAILED');
  }
};

const getCandidateByIdService = async (candidateId: string) => {
  const candidate = await candidateModel.findById(candidateId);

  if (!candidate) {
    return null;
  }

  let profileUrl: string | null = null;
  if (candidate.profile) {
    profileUrl = await presignedUrlUtil.generatePresignedUrl(candidate.profile);
  }

  let profilePictureUrl: string | null = null;
  if (candidate.profilePicture) {
    profilePictureUrl = await presignedUrlUtil.generatePresignedUrl(candidate.profilePicture);
  }

  return {
    id: candidate.id,
    email: candidate.email,
    firstName: candidate.firstName || '',
    lastName: candidate.lastName || '',
    mobileNumber: candidate.mobileNumber || '',
    gender: candidate.gender || '',
    dateOfBirth: candidate.dateOfBirth || '',
    address: candidate.address || '',
    profilePicture: profilePictureUrl || '',
    category: candidate.category || '',
    designation: candidate.designation || '',
    experience: candidate.experience || '',
    profile: candidate.profile || '',
    profileUrl: profileUrl,
    createdAt: candidate.createdAt,
    updatedAt: candidate.updatedAt,
  };
};

export default {
  recruiterLogin,
  getAllJobsService,
  getJobByIdService,
  getAllClientsService,
  getClientByIdService,
  getAllCandidatesService,
  getCandidateByIdService,
};
