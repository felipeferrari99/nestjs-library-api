import { Test, TestingModule } from "@nestjs/testing";
import { BookService } from "../book.service";
import { CreateBookDTO } from "../dto/create-book.dto";
import { validate } from "class-validator";
import { Books } from "../entity/book.entity";
import { CloudinaryService } from "../../cloudinary/cloudinary.service";
import { NotFoundException } from "@nestjs/common";

const mockBookRepository = {
    exists: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};

describe('BookService', () => {
    let bookService: BookService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CloudinaryService,
                BookService,
                { provide: 'BooksRepository', useValue: mockBookRepository },
            ],
        }).compile();

        bookService = module.get<BookService>(BookService);
    });

    describe('DTO validation', () => {
        it('should pass validation with valid fields', async () => {
            const data = new CreateBookDTO();
            data.title = 'Book 1';
            data.authorName = '';
            data.release_date = '2024-04-24';
            data.qty_available = 0;

            const errors = await validate(data);

            expect(errors.length).toEqual(0);
        });

        it('should fail validation with empty fields', async () => {
            const data = new CreateBookDTO();

            const errors = await validate(data);

            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].constraints).toHaveProperty('isNotEmpty');
        });
    });

    describe('create', () => {
        it('should create a new book', async () => {
            const data = new CreateBookDTO();
            data.title = 'Book 1';
            const bookMock: Books = { id: 1, ...data, favorite: [], comments: [], rents: [], author: {id: 1, name: '', description: null, image: null, books: []} };

            mockBookRepository.exists.mockResolvedValueOnce(null);
            mockBookRepository.create.mockReturnValueOnce(bookMock);
            mockBookRepository.save.mockResolvedValueOnce(bookMock);

            const result = await bookService.create(data);

            expect(result).toEqual(bookMock);
        });
    });

    describe('list', () => {
        it('Should return all books', async () => {
            const bookMock: Books[] = [
                { id: 1, title: 'Book 1', image: null, description: null, release_date: '', qty_available: 0, author_id: 1, favorite: [], comments: [], rents: [], author: {id: 1, name: '', description: null, image: null, books: []}  },
                { id: 2, title: 'Book 2', image: null, description: null, release_date: '', qty_available: 0, author_id: 1, favorite: [], comments: [], rents: [], author: {id: 1, name: '', description: null, image: null, books: []}  }
            ]

            mockBookRepository.find.mockResolvedValueOnce(bookMock)

            const result = await bookService.list('');

            expect(result).toEqual(bookMock);
        })
    })

    describe('show', () => {
        it('Should return one Book', async () => {
            const bookMock: Books = { id: 1, title: 'Book 1', image: null, description: null, release_date: '', qty_available: 0, author_id: 1, favorite: [], comments: [], rents: [], author: {id: 1, name: '', description: null, image: null, books: []}  }

            jest.spyOn(bookService, 'exists').mockResolvedValueOnce(undefined);

            mockBookRepository.findOne.mockResolvedValue(bookMock)

            const result = await bookService.show(1);

            expect(result).toEqual(bookMock);
        })

        it('should throw NotFoundException if book with the specified ID is not found', async () => {
            jest.spyOn(bookService, 'exists').mockRejectedValueOnce(new NotFoundException());

            mockBookRepository.findOne.mockResolvedValueOnce(null);

            await expect(bookService.show(0)).rejects.toThrow(NotFoundException);
        });
    });

    describe('updatePartial', () => {
        it('should update the book with the specified ID and return the updated book', async () => {
            const updatedBook: Books = { id: 1, title: 'Book 1', image: null, description: null, release_date: '', qty_available: 0, author_id: 1, favorite: [], comments: [], rents: [], author: {id: 1, name: '', description: null, image: null, books: []}  };

            jest.spyOn(bookService, 'exists').mockResolvedValueOnce(undefined);

            mockBookRepository.update.mockResolvedValueOnce({});

            jest.spyOn(bookService, 'show').mockResolvedValueOnce(updatedBook);
    
            const result = await bookService.updatePartial(1, { title: 'Book 1' });
    
            expect(result).toEqual(updatedBook);
        });
    
        it('should throw NotFoundException if book with the specified ID is not found', async () => {
            jest.spyOn(bookService, 'exists').mockRejectedValueOnce(new NotFoundException());
            await expect(bookService.updatePartial(999, { title: 'Book 2' })).rejects.toThrow(NotFoundException);
        });
    });

    describe('delete', () => {
        it('should remove the book with the specified ID and return "true".', async () => {
            jest.spyOn(bookService, 'exists').mockResolvedValueOnce();
            jest.spyOn(bookService, 'deleteBookImage').mockResolvedValueOnce();
    
            mockBookRepository.delete.mockResolvedValueOnce(undefined);
    
            const result = await bookService.delete(1);
    
            expect(mockBookRepository.delete).toBeCalledWith(1);
            expect(result).toEqual(true);
        });
    
        it('should throw NotFoundException if book with the specified ID is not found', async () => {
            jest.spyOn(bookService, 'exists').mockRejectedValueOnce(new NotFoundException());

            await expect(bookService.delete(0)).rejects.toThrow(NotFoundException);
        });
    });

    describe('exists', () => {
        it('should throw NotFoundException if book does not exist', async () => {
            mockBookRepository.exists.mockResolvedValue(false);
     
            await expect(bookService.exists(0)).rejects.toThrowError(NotFoundException);
            expect(mockBookRepository.exists).toHaveBeenCalledWith({
                where: { id: 0 }
            });
        });

        it('should not throw NotFoundException if book exists', async () => {
            mockBookRepository.exists.mockResolvedValue(true);

            await expect(bookService.exists(1)).resolves.not.toThrowError(NotFoundException);
            expect(mockBookRepository.exists).toHaveBeenCalledWith({
                where: { id: 1 }
            });
        });
    });
});