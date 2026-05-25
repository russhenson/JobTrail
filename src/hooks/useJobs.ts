import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@_utils';

export type StatusCounts = {
    Saved: number;
    Applied: number;
    'Follow Up': number;
    Interview: number;
    Offer: number;
    Hired: number;
    Rejected: number;
};

export type UpcomingInterview = {
    company: string;
    role: string;
    datetime: string;
};

export type RecentApplication = {
    jobTitle: string;
    company: string;
    daysAgo: number;
};

export type Job = {
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

export type JobsResponse = {
    jobs: Job[];
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    total: number;
    statusCounts: StatusCounts;
    upcomingInterview: UpcomingInterview | null;
    pendingFollowUps: number;
    recentApplication: RecentApplication | null;
};

type Filters = {
    status?: string;
    dateFilter?: string;
};

const fetchJobs =
    (filters: Filters) =>
    async ({ pageParam = 1 }): Promise<JobsResponse> => {
        const params = new URLSearchParams();
        params.append('page', String(pageParam));
        if (filters.status) params.append('status', filters.status);
        if (filters.dateFilter) params.append('dateFilter', filters.dateFilter);

        const res = await api.get(`/jobs?${params.toString()}`);
        return res.data;
    };

export const useJobs = (filters: Filters = {}) =>
    useInfiniteQuery({
        queryKey: ['jobs', filters],
        queryFn: fetchJobs(filters),
        initialPageParam: 1,
        getNextPageParam: lastPage => (lastPage.hasNextPage ? lastPage.page + 1 : undefined),
    });
