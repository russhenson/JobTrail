const mockJobCreate = jest.fn();
const mockJobFind = jest.fn();
const mockJobCountDocuments = jest.fn();

jest.mock('../api/src/models/Job', () => ({
    create: mockJobCreate,
    find: () => ({ sort: () => ({ skip: () => ({ limit: mockJobFind }) }) }),
    countDocuments: mockJobCountDocuments,
}));

const { createJob, getJobs } = require('../api/src/controllers/jobController');

const mockRes = () => {
    const res = {
        status: jest.fn(),
        json: jest.fn(),
    };
    res.status.mockReturnValue(res);
    res.json.mockReturnValue(res);
    return res;
};

const mockReq = (body = {}, query = {}) => ({
    body,
    query,
    user: { userId: '507f1f77bcf86cd799439011' },
    params: {},
});

describe('createJob', () => {
    beforeEach(() => jest.clearAllMocks());

    it('should return 400 if required fields are missing', async () => {
        const req = mockReq({ company: 'Google' }); // missing role, location etc
        const res = mockRes();

        await createJob(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Please fill in all required fields.',
        });
    });

    it('should create a job with all required fields', async () => {
        const jobData = {
            company: 'Google',
            role: 'Engineer',
            location: 'Manila, PH',
            dateApplied: '2025-01-20T00:00:00.000Z',
            status: 'Applied',
            jobType: 'Full-time',
            jobSetup: 'Hybrid',
        };

        mockJobCreate.mockResolvedValue({ _id: 'newid123', ...jobData });

        const req = mockReq(jobData);
        const res = mockRes();

        await createJob(req, res);

        expect(mockJobCreate).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should set optional fields to null if not provided', async () => {
        const jobData = {
            company: 'Google',
            role: 'Engineer',
            location: 'Manila, PH',
            dateApplied: '2025-01-20T00:00:00.000Z',
            status: 'Applied',
            jobType: 'Full-time',
            jobSetup: 'Hybrid',
        };

        mockJobCreate.mockResolvedValue({ _id: 'newid123', ...jobData });

        const req = mockReq(jobData);
        const res = mockRes();

        await createJob(req, res);

        const callArg = mockJobCreate.mock.calls[0][0];
        expect(callArg.salary).toBeNull();
        expect(callArg.notes).toBeNull();
        expect(callArg.interviewDatetime).toBeNull();
    });

    it('should handle server error gracefully', async () => {
        mockJobCreate.mockRejectedValue(new Error('DB error'));

        const req = mockReq({
            company: 'Google',
            role: 'Engineer',
            location: 'Manila, PH',
            dateApplied: '2025-01-20T00:00:00.000Z',
            status: 'Applied',
            jobType: 'Full-time',
            jobSetup: 'Hybrid',
        });
        const res = mockRes();

        await createJob(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
});

describe('getJobs pagination', () => {
    beforeEach(() => jest.clearAllMocks());

    it('should default to page 1', async () => {
        mockJobFind.mockResolvedValue([]);
        mockJobCountDocuments.mockResolvedValue(0);

        const req = mockReq({}, {});
        const res = mockRes();

        await getJobs(req, res);

        const response = res.json.mock.calls[0][0];
        expect(response.page).toBe(1);
    });

    it('should calculate hasNextPage correctly', async () => {
        mockJobFind.mockResolvedValue([{}, {}, {}]); // 3 jobs
        mockJobCountDocuments.mockResolvedValue(10); // 10 total

        const req = mockReq({}, { page: '1' });
        const res = mockRes();

        await getJobs(req, res);

        const response = res.json.mock.calls[0][0];
        expect(response.hasNextPage).toBe(true);
        expect(response.totalPages).toBe(4); // ceil(10/3)
    });

    it('should return hasNextPage false on last page', async () => {
        mockJobFind.mockResolvedValue([{}]); // 1 job
        mockJobCountDocuments.mockResolvedValue(7); // 7 total, page 3 = last

        const req = mockReq({}, { page: '3' });
        const res = mockRes();

        await getJobs(req, res);

        const response = res.json.mock.calls[0][0];
        expect(response.hasNextPage).toBe(false);
    });
});
