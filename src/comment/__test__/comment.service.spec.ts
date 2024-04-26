import { Test, TestingModule } from "@nestjs/testing";
import { CommentService } from "../comment.service";
import { CreateCommentDTO } from "../dto/create-comment.dto";
import { validate } from "class-validator";

const mockCommentRepository = {
    exists: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};

describe('CommentService', () => {
    let commentService: CommentService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CommentService,
                { provide: 'CommentsRepository', useValue: mockCommentRepository },
            ],
        }).compile();

        commentService = module.get<CommentService>(CommentService);
    });

    describe('DTO validation', () => {
        it('should pass validation with valid comment data', async () => {
            const data = new CreateCommentDTO();
            data.rating = 5;
            data.body = "review";
            data.book_id = 1;

            const errors = await validate(data);

            expect(errors.length).toEqual(0);
        });

        it('should fail validation with invalid comment data', async () => {
            const data = new CreateCommentDTO();
            data.rating = -5;
            data.body = "review";
            data.book_id = null;

            const errors = await validate(data);

            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].constraints)
        });
    });
});