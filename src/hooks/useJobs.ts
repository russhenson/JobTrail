import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@_utils';

type Job = {
    _id: string;
    company: string;
    role: string;
    status: string;
    dateApplied: string;
    location: string;
    jobSetup: string;
    jobType: string;
    salary?: string;
    applicationLink?: string;
    interviewDatetime?: string;
    interviewLink?: string;
    recruiterName?: string;
    recruiterContact?: string;
    notes?: string;
};

type JobsResponse = {
    jobs: Job[];
page: number;
    totalPages: number;
    hasNextPage: boolean;
};

const fetchJobs = async ({ pageParam = 1 }): Promise<JobsResponse> => {
    const res = await api.get(`/jobs?page=${pageParam}`);
    return res.data;
};

export const useJobs = () =>
    useInfiniteQuery({
        queryKey: ['jobs'],
        queryFn: fetchJobs,
        initialPageParam: 1,
        getNextPageParam: lastPage => (lastPage.hasNextPage ? lastPage.page + 1 : undefined),
    });
