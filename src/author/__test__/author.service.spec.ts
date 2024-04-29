import { Test, TestingModule } from '@nestjs/testing';
import { AuthorService } from '../author.service';
import { CreateAuthorDTO } from '../dto/create-author.dto';
import { Authors } from '../types/author.entity';
import { NotFoundException } from '@nestjs/common';
import { validate } from 'class-validator';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';

const mockAuthorRepository = {
    exists: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};

describe('AuthorService', () => {
    let authorService: AuthorService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CloudinaryService,
                AuthorService,
                { provide: 'AuthorsRepository', useValue: mockAuthorRepository },
            ],
        }).compile();

        authorService = module.get<AuthorService>(AuthorService);
    });


    describe('DTO validation', () => {
        it('should pass validation with a valid name', async () => {
            const data = new CreateAuthorDTO();
            data.name = 'Author 1';

            const errors = await validate(data);

            expect(errors.length).toEqual(0);
        });

        it('should fail validation with an empty name', async () => {
            const data = new CreateAuthorDTO();
            data.name = '';

            const errors = await validate(data);

            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].constraints).toHaveProperty('isNotEmpty');
        });
    });

    describe('create', () => {
        it('should create a new author', async () => {
            const data = new CreateAuthorDTO();
            data.name = 'Author 1';
            const authorMock: Authors = { id: 1, ...data, books: [] };

            mockAuthorRepository.exists.mockResolvedValueOnce(null);
            mockAuthorRepository.create.mockReturnValueOnce(authorMock);
            mockAuthorRepository.save.mockResolvedValueOnce(authorMock);

            const result = await authorService.create(data);

            expect(result).toEqual(authorMock);
        });
    });

    describe('list', () => {
        it('Should return all authors', async () => {
            const authorMock: Authors[] = [
                { id: 1, name: 'Author 1', books: [], image: null, description: null },
                { id: 2, name: 'Author 2', books: [], image: null, description: null },
            ]

            mockAuthorRepository.find.mockResolvedValueOnce(authorMock)

            const result = await authorService.list('');

            expect(result).toEqual(authorMock);
        })
    })

    describe('show', () => {
        it('Should return one Author', async () => {
            const authorMock: Authors = { id: 1, name: 'Author 1', books: [], image: null, description: null }

            jest.spyOn(authorService, 'exists').mockResolvedValueOnce(undefined);

            mockAuthorRepository.findOne.mockResolvedValue(authorMock)

            const result = await authorService.show(1);

            expect(result).toEqual(authorMock);
        })

        it('should throw NotFoundException if author with the specified ID is not found', async () => {
            jest.spyOn(authorService, 'exists').mockRejectedValueOnce(new NotFoundException());

            mockAuthorRepository.findOne.mockResolvedValueOnce(null);

            await expect(authorService.show(0)).rejects.toThrow(NotFoundException);
        });
    });

    describe('updatePartial', () => {
        it('should update the author with the specified ID and return the updated author', async () => {
            const updatedAuthor: Authors = { id: 1, name: 'Author 1', books: [], description: null, image: null };

            jest.spyOn(authorService, 'exists').mockResolvedValueOnce(undefined);

            mockAuthorRepository.update.mockResolvedValueOnce({});

            jest.spyOn(authorService, 'show').mockResolvedValueOnce(updatedAuthor);
    
            const result = await authorService.updatePartial(1, { name: 'Author 1' });
    
            expect(result).toEqual(updatedAuthor);
        });
    
        it('should throw NotFoundException if author with the specified ID is not found', async () => {
            jest.spyOn(authorService, 'exists').mockRejectedValueOnce(new NotFoundException());
            await expect(authorService.updatePartial(999, { name: 'Author 2' })).rejects.toThrow(NotFoundException);
        });
    });

    describe('delete', () => {
        it('should remove the author with the specified ID and return "true".', async () => {
            jest.spyOn(authorService, 'exists').mockResolvedValueOnce();
            jest.spyOn(authorService, 'deleteAuthorImage').mockResolvedValueOnce();
    
            mockAuthorRepository.delete.mockResolvedValueOnce(undefined);
    
            const result = await authorService.delete(1);
    
            expect(mockAuthorRepository.delete).toBeCalledWith(1);
            expect(result).toEqual(true);
        });
    
        it('should throw NotFoundException if author with the specified ID is not found', async () => {
            jest.spyOn(authorService, 'exists').mockRejectedValueOnce(new NotFoundException());

            await expect(authorService.delete(0)).rejects.toThrow(NotFoundException);
        });
    });

    describe('exists', () => {
        it('should throw NotFoundException if author does not exist', async () => {
            mockAuthorRepository.exists.mockResolvedValue(false);
     
            await expect(authorService.exists(0)).rejects.toThrowError(NotFoundException);
            expect(mockAuthorRepository.exists).toHaveBeenCalledWith({
                where: { id: 0 }
            });
        });

        it('should not throw NotFoundException if author exists', async () => {
            mockAuthorRepository.exists.mockResolvedValue(true);

            await expect(authorService.exists(1)).resolves.not.toThrowError(NotFoundException);
            expect(mockAuthorRepository.exists).toHaveBeenCalledWith({
                where: { id: 1 }
            });
        });
    });
});