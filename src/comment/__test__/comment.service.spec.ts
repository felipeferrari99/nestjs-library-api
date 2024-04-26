import { Test, TestingModule } from "@nestjs/testing";
import { CommentService } from "../comment.service";
import { CreateCommentDTO } from "../dto/create-comment.dto";
import { validate } from "class-validator";
import { Comments } from "../entity/comment.entity";
import { NotFoundException } from "@nestjs/common";

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
            data.body = "very good";
            data.book_id = 1;

            const errors = await validate(data);

            expect(errors.length).toEqual(0);
        });

        it('should fail validation with invalid comment data', async () => {
            const data = new CreateCommentDTO();
            data.rating = -5;
            data.body = "very good";
            data.book_id = null;

            const errors = await validate(data);

            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].constraints)
        });
    });

    describe('create', () => {
        it('should create a new comment', async () => {
            const data: CreateCommentDTO = { rating: 5, body:"very good", book_id: 1 };
            const mockComment: Comments = {
                id: 1, ...data,
                user_id: 1,
                user: {id: 1, username: 'User 1', email: 'user@gmail.com', password: '123', type: 'user', image: null, description: null, comments: [], favorite_book: null, book: null, rents: []},
                books: {
                    id: 1,
                    title: '',
                    author_id: 1,
                    qty_available: 5,
                    release_date: '',
                    description: null,
                    image: '',
                    author: {
                        id: 1,
                        name: '',
                        books: [],
                        image: null,
                        description: null
                    },
                    rents: [],
                    favorite: [],
                    comments: [],
                },
            };

            mockCommentRepository.findOne.mockResolvedValueOnce(null);
            mockCommentRepository.create.mockReturnValueOnce(mockComment);
            mockCommentRepository.save.mockResolvedValueOnce(mockComment);

            const result = await commentService.create(data);

            expect(result).toEqual(mockComment);
        });
    });

    describe('delete', () => {
        it('should remove the comment with the specified ID and return true', async () => {
            jest.spyOn(commentService, 'exists').mockResolvedValueOnce(undefined);

            const deleteInfo = true;

            mockCommentRepository.delete.mockResolvedValueOnce(deleteInfo);

            const result = await commentService.delete(1, 1);
            expect(result).toEqual(deleteInfo);
        });

        it('should throw NotFoundException if the comment with the specified ID is not found', async () => {
            jest.spyOn(commentService, 'exists').mockRejectedValueOnce(new NotFoundException());

            await expect(commentService.delete(1, 999999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('exists', () => {
        it('should throw NotFoundException if the comment does not exist', async () => {
            mockCommentRepository.exists.mockResolvedValue(false);

            await expect(commentService.exists(0)).rejects.toThrow(NotFoundException);
            expect(mockCommentRepository.exists).toHaveBeenCalledWith({
                where: { id: 0 }
            });
        });

        it('should not throw NotFoundException if the comment exists', async () => {
            mockCommentRepository.exists.mockResolvedValue(true);

            await expect(commentService.exists(1)).resolves.not.toThrow(NotFoundException);
            expect(mockCommentRepository.exists).toHaveBeenCalledWith({
                where: { id: 1 }
            });
        });
    });
});