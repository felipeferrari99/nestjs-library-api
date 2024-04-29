import { Test, TestingModule } from "@nestjs/testing";
import { RentsService } from "../rent.service";
import { CreateRentDTO } from "../dto/create-rent.dto";
import { validate } from "class-validator";
import { BookService } from "../../book/book.service";
import { CloudinaryService } from "../../cloudinary/cloudinary.service";
import { Rents } from "../entity/rent.entity";
import { NotFoundException } from "@nestjs/common";
import { Books } from "../../book/types/book.entity";

const mockRentRepository = {
    exists: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};

const mockBookRepository = {
    exists: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};

describe('AuthorService', () => {
    let rentsService: RentsService;
    let bookService: BookService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CloudinaryService,
                BookService,
                { provide: 'BooksRepository', useValue: mockBookRepository },
                RentsService,
                { provide: 'RentsRepository', useValue: mockRentRepository },
            ],
        }).compile();

        rentsService = module.get<RentsService>(RentsService);
        bookService = module.get<BookService>(BookService);
    });

    describe('DTO validation', () => {
        it('should pass validation with valid user and book IDs', async () => {
            const data = new CreateRentDTO();
            data.book_id = 1;
            data.user_id = 1;

            const errors = await validate(data);

            expect(errors.length).toEqual(0);
        });

        it('should fail validation with an empty user ID', async () => {
            const data = new CreateRentDTO();
            data.user_id = null;

            const errors = await validate(data);

            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].constraints).toHaveProperty('isNotEmpty');
        });
    });

    describe('create', () => {
        it('should create a new rent', async () => {
            const data = new CreateRentDTO();
            data.book_id = 1;
            data.user_id = 1;
            const date = new Date();
            date.setDate(date.getDate() + 5);

            const mockRent: Rents = {
                id: 1, ...data,
                user: {
                    id: 1,
                    username: '',
                    email: '',
                    password: '',
                    image: '',
                    type: 'user',
                    description: '',
                    favorite_book: null,
                    rents: [],
                    comments: [],
                    book: null
                },
                book: {
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
                status: 'active',
                date_rented: new Date().toISOString(),
                date_for_return: date.toISOString()
            }

            jest.spyOn(bookService, 'show').mockResolvedValueOnce({
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
            });

            jest.spyOn(bookService, 'updatePartial').mockResolvedValueOnce(mockRent.book)
        
            mockRentRepository.create.mockReturnValueOnce(mockRent);

            mockRentRepository.save.mockResolvedValueOnce(mockRent);

            const result = await rentsService.create(data);

            expect(result).toEqual(mockRent);
        });
    });

    describe('list', () => {
        it('should return all rents', async () => {
            const date = new Date();
            date.setDate(date.getDate() + 5);
            const mockRent = [
                {
                    id: 1, 
                    user_id: 1,
                    book_id: 1,
                    user: {
                    id: 1,
                    username: '',
                    email: '',
                    password: '',
                    image: '',
                    type: 'user',
                    description: '',
                    favorite_book: null,
                    rents: [],
                    comments: [],
                    book: null
                    },
                    book: {
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
                status: 'active',
                date_rented: new Date().toISOString(),
                date_for_return: date.toISOString()
                },
                {
                    id: 2, 
                    user_id: 1,
                    book_id: 2,
                    user: {
                    id: 1,
                    username: '',
                    email: '',
                    password: '',
                    image: '',
                    type: 'user',
                    description: '',
                    favorite_book: null,
                    rents: [],
                    comments: [],
                    book: null
                    },
                    book: {
                    id: 2,
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
                status: 'active',
                date_rented: new Date().toISOString(),
                date_for_return: date.toISOString()
                },
            ]

            mockRentRepository.find.mockResolvedValueOnce(mockRent)

            const result = await rentsService.listAllRents();

            expect(result).toEqual(mockRent);
        });
    });

    describe('returnBook', () => {
        it('should return the rent with the specified ID and return the saved information', async () => {
            const date = new Date();
            date.setDate(date.getDate() + 5);
            const mockBook: Books = {
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
            };

            const mockRent: Rents = {
                id: 1,
                user_id: 1,
                book_id: 1,
                status: 'active',
                date_rented: new Date().toISOString(),
                date_for_return: date.toISOString(),
                date_returned: null,
                user: {
                    id: 1,
                    username: '',
                    email: '',
                    password: '',
                    image: '',
                    type: 'user',
                    description: '',
                    favorite_book: null,
                    rents: [],
                    comments: [],
                    book: null
                },
                book: mockBook
            };
    
            jest.spyOn(mockRentRepository, 'findOne').mockResolvedValueOnce(mockRent);
            jest.spyOn(bookService, 'show').mockResolvedValueOnce(mockBook);
            jest.spyOn(bookService, 'updatePartial').mockResolvedValueOnce(mockBook);
    
            const updatedRent = { ...mockRent, status: 'returned', date_returned: new Date().toISOString().split('T')[0] };
            jest.spyOn(mockRentRepository, 'save').mockResolvedValueOnce(updatedRent);
    
            const result = await rentsService.returnBook(1);
    
            expect(mockRentRepository.save).toHaveBeenCalledWith(updatedRent);
            expect(result).toEqual(updatedRent);
        });

        it('should throw NotFoundException if book with the specified ID is not found', async () => {
            jest.spyOn(rentsService, 'exists').mockRejectedValueOnce(new NotFoundException());

            await expect(rentsService.exists(99999)).rejects.toThrow(NotFoundException);
        });
    });
    
    describe('exists', () => {
        it('should throw NotFoundException if rent does not exist', async () => {
            mockRentRepository.exists.mockResolvedValue(false);
     
            await expect(rentsService.exists(0)).rejects.toThrowError(NotFoundException);
            expect(mockRentRepository.exists).toHaveBeenCalledWith({
                where: { id: 0 }
            });
        });

        it('should not throw NotFoundException if rent exists', async () => {
            mockRentRepository.exists.mockResolvedValue(true);

            await expect(rentsService.exists(1)).resolves.not.toThrowError(NotFoundException);
            expect(mockRentRepository.exists).toHaveBeenCalledWith({
                where: { id: 1 }
            });
        });
    });
});