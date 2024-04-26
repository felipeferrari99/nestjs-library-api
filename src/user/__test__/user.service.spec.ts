import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../user.service";
import { CloudinaryService } from "../../cloudinary/cloudinary.service";
import { CreateUserDTO } from "../dto/create-user.dto";
import { validate } from "class-validator";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { Users } from "../entity/user.entity";

const mockUserRepository = {
    exists: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};

describe('UserService', () => {
    let userService: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                JwtModule.register({
                  secret: process.env.JWT_SECRET || 'test_secret_key',
                  signOptions: { expiresIn: '1h' },
                })
            ],
            providers: [
                CloudinaryService,
                JwtService,
                UserService,
                { provide: 'UsersRepository', useValue: mockUserRepository },
            ],
        }).compile();

        userService = module.get<UserService>(UserService);
    });

    describe('DTO validation', () => {
        it('should pass validation with a valid username', async () => {
            const data = new CreateUserDTO();
            data.username = 'user';
            data.email = 'user@mail.com';
            data.password = '123';

            const errors = await validate(data);

            expect(errors.length).toEqual(0);
        });

        it('should fail validation with an empty username', async () => {
            const data = new CreateUserDTO();
            data.username = '';

            const errors = await validate(data);

            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].constraints).toHaveProperty('isNotEmpty');
        });
    });

    describe('create', () => {
        it('should create a new user', async () => {
            const data = new CreateUserDTO();
            data.username = 'Author 1';
            data.password = '123'
            const userMock: Users = { id: 1, ...data, type: 'user', comments: [], rents: [], book: null, favorite_book: null };

            mockUserRepository.exists.mockResolvedValueOnce(null);
            mockUserRepository.create.mockReturnValueOnce(userMock);
            mockUserRepository.save.mockResolvedValueOnce(userMock);

            const result = await userService.create(data);

            expect(result).toEqual(userMock);
        });
    });
});