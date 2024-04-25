import { Test, TestingModule } from "@nestjs/testing";
import { RentsService } from "../rent.service";
import { CreateRentDTO } from "../dto/create-rent.dto";
import { validate } from "class-validator";
import { BookService } from "../../book/book.service";
import { CloudinaryService } from "../../cloudinary/cloudinary.service";

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
})