import { Test, TestingModule } from '@nestjs/testing';
import { MemberResolver } from './member.resolver';
import { NotFoundException } from '@nestjs/common';
import { members } from '../data/members.data';

describe('MemberResolver', () => {
  let resolver: MemberResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemberResolver],
    }).compile();

    resolver = module.get<MemberResolver>(MemberResolver);
  });

  describe('getAllMembers', () => {
    it('should all members if no arguments are provided', () => {
      expect(resolver.getAllMembers()).toEqual(members);
    });

    it('should filter members by membership type', () => {
      const filteredMembers = resolver.getAllMembers('GOLD');

      expect(filteredMembers.length).toBe(1);
      expect(filteredMembers).toEqual([members[0]]);
    });

    it('should apply pagination correctly', () => {
      const filteredMembers = resolver.getAllMembers(undefined, 1, 1); // Limit 1, Offset 1

      expect(filteredMembers.length).toBe(1);
      expect(filteredMembers).toEqual([members[1]]);
    });

    it('should return an empty array if no members match the criteria', () => {
      const result = resolver.getAllMembers('PLATINUM'); // Invalid membershipType
      expect(result).toEqual([]);
    });
  });

  describe('getMemberByEmail', () => {
    it('should return a member for a valid email', () => {
      const result = resolver.getMemberByEmail('john.doe@example.com');
      expect(result).toEqual(members[0]);
    });

    it('should throw a NotFoundException for an invalid email', () => {
      expect(() => resolver.getMemberByEmail('invalid@example.com')).toThrow(
        NotFoundException,
      );
    });
  });
});
