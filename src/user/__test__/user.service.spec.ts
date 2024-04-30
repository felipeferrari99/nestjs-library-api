import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../user.service";
import { CloudinaryService } from "../../cloudinary/cloudinary.service";
import { CreateUserDTO } from "../../GraphQL/user/inputs/create-user.input";
import { validate } from "class-validator";
import { JwtService } from "@nestjs/jwt";
import { Users } from "../entity/user.entity";
import { BadRequestException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Books } from "../../book/entity/book.entity";
import * as bcrypt from 'bcrypt';

const mockUserRepository = {
    exists: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findOneBy: jest.fn()
};

describe('UserService', () => {
    let userService: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
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
            data.username = 'user';
            data.email = 'user@mail.com';
            data.password = '123';
    
            mockUserRepository.exists.mockResolvedValueOnce(false); 
            mockUserRepository.save.mockResolvedValueOnce({
                id: 1,
                ...data,
                type: 'user',
                comments: [],
                rents: [],
                book: null,
                favorite_book: null
            });
    
            const result = await userService.create(data);
    
            const decodedToken = JSON.parse(atob(result.token.split('.')[1]));
            expect(decodedToken).toHaveProperty('username', data.username);
        });    

        it('should throw BadRequestException if username is already used', async () => {
            const data: Users = { id: 1, username: 'user', email: 'user@mail.com', password: '123', image: null, description: '', type: 'user', comments: [], rents: [], book: null, favorite_book: null };

            mockUserRepository.exists.mockResolvedValue(true)

            await expect(userService.create(data)).rejects.toThrow(BadRequestException);
        });
    });

    describe('login', () => {
        it('should return a token when username and password are correct', async () => {
            const mockUser = {
                id: 1,
                username: 'testuser',
                password: await bcrypt.hash('password', 10)
            };
    
            mockUserRepository.findOneBy.mockResolvedValueOnce(mockUser);
    
            const result = await userService.login('testuser', 'password');
    
            expect(result).toHaveProperty('token');
        });
    
        it('should throw UnauthorizedException when username is correct but password is incorrect', async () => {
            const mockUser = {
                id: 1,
                username: 'testuser',
                password: await bcrypt.hash('password', 10)
            };
    
            mockUserRepository.findOneBy.mockResolvedValueOnce(mockUser);

            await expect(userService.login('testuser', 'wrongpassword')).rejects.toThrow(UnauthorizedException);
        });
    
        it('should throw UnauthorizedException when username is not found', async () => {
            mockUserRepository.findOneBy.mockResolvedValueOnce(null);
    
            await expect(userService.login('nonexistentuser', 'password')).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('show', () => {
        it('Should return one user', async () => {
            const mockUser: Users = { id: 1, username: 'user', email: 'user@mail.com', password: '123', image: null, description: '', type: 'user', comments: [], rents: [], book: null, favorite_book: null };

            jest.spyOn(userService, 'exists').mockResolvedValueOnce(undefined);

            mockUserRepository.findOne.mockResolvedValue(mockUser)

            const result = await userService.show(1);

            expect(result).toEqual(mockUser);

        })

        it('should throw NotFoundException if the user with the specified ID is not found', async () => {
            jest.spyOn(userService, 'exists').mockRejectedValueOnce(new NotFoundException());

            mockUserRepository.findOne.mockResolvedValueOnce(null);

            await expect(userService.show(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('updatePartial', () => {
        it('should update the User with the specified ID and return the updated user', async () => {
            const updatedUser: Users = { id: 1, username: 'user', email: 'user@mail.com', password: '123', image: null, description: '', type: 'user', comments: [], rents: [], book: null, favorite_book: null };

            jest.spyOn(userService, 'exists').mockResolvedValueOnce(undefined);

            mockUserRepository.update.mockResolvedValueOnce({});

            jest.spyOn(userService, 'show').mockResolvedValueOnce(updatedUser);
    
            const result = await userService.updatePartial(1, { email: 'user@mail.com' });
    
            expect(result).toEqual(updatedUser);
        });
    
        it('should throw NotFoundException if user with the specified ID is not found', async () => {
            jest.spyOn(userService, 'exists').mockRejectedValueOnce(new NotFoundException());
            await expect(userService.updatePartial(999, { email: 'user@mail.com' })).rejects.toThrow(NotFoundException);
        });
    });

    describe('updateFavorite', () => {
        it('should update the favorite_book of the user with the specified ID and return the updated user', async () => {
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
            const updatedUser: Users = { id: 1, username: 'user', email: 'user@mail.com', password: '123', image: null, description: '', type: 'user', comments: [], rents: [], book: mockBook, favorite_book: 1 };

            jest.spyOn(userService, 'exists').mockResolvedValueOnce(undefined);

            mockUserRepository.update.mockResolvedValueOnce({});

            jest.spyOn(userService, 'show').mockResolvedValueOnce(updatedUser);
    
            const result = await userService.updateFavorite(1, {
                username: 'user', 
                password: '123', 
                favorite_book: 1,
                id: 1,
                email: "user@mail.com",
                type: "user",
                image: null,
                description: "",
                comments: [],
                rents: [],
                book: mockBook
            });
    
            expect(result).toEqual(updatedUser);
        });
    });

    describe('exists', () => {
        it('should throw NotFoundException if the user does not exist', async () => {
            mockUserRepository.exists.mockResolvedValue(false);

            await expect(userService.exists(0)).rejects.toThrow(NotFoundException);
            expect(mockUserRepository.exists).toHaveBeenCalledWith({
                where: { id: 0 }
            });
        });

        it('should not throw NotFoundException if the user exists', async () => {
            mockUserRepository.exists.mockResolvedValue(true);

            await expect(userService.exists(1)).resolves.not.toThrow(NotFoundException);
            expect(mockUserRepository.exists).toHaveBeenCalledWith({
                where: { id: 1 }
            });
        });
    });
});