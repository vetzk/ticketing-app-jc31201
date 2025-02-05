import prisma from '../prisma';
import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export class ProfileController {
  async getProfileUser(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(res.locals.decrypt.id);

      if (res.locals.decrypt.id) {
        const findUser = await prisma.userprofile.findFirst({
          where: {
            userId: res.locals.decrypt.id,
          },
        });

        if (!findUser) {
          console.log('USER:', findUser);

          return res.status(404).send({
            success: false,
            message: 'User not found',
          });
        }
      }
      const profile = await prisma.userprofile.findMany({
        where: { userId: res.locals.decrypt.id },
        select: {
          firstName: true,
          lastName: true,
          gender: true,
          address: true,
          phoneNumber: true,
          dateOfBirth: true,
          isAdded: true,
          location: {
            select: {
              locationName: true,
            },
          },
          image: true,
        },
      });

      return res.status(200).send({
        success: true,
        result: profile,
      });
    } catch (error) {
      console.log(error);

      next({ success: false, message: 'Failed to get your information' });
    }
  }
  async addProfileUser(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        address,
        dateOfBirth,
        firstName,
        lastName,
        gender,
        location,
        phoneNumber,
      } = req.body;

      console.log(res.locals.decrypt);

      if (res.locals.decrypt.id) {
        const findUser = await prisma.user.findUnique({
          where: {
            id: res.locals.decrypt.id,
          },
        });

        if (!findUser) {
          return res.status(404).send({
            succesS: false,
            message: 'Profile not found',
          });
        }
        const findLocation = await prisma.location.findFirst({
          where: {
            locationName: location,
          },
        });

        if (findLocation) {
          const createProfile = await prisma.userprofile.create({
            data: {
              userId: findUser.id,
              address,
              dateOfBirth: new Date(dateOfBirth).toISOString(),
              firstName,
              lastName,
              gender,
              phoneNumber,
              isAdded: true,
              image: `/assets/profile/${req.file?.filename}`,
              locationId: findLocation?.id,
            },
          });

          return res.status(200).send({
            success: true,
            message: 'successfully add your profile',
            result: createProfile,
          });
        } else {
          const createLocation = await prisma.location.create({
            data: {
              locationName: location,
            },
          });

          const createProfile = await prisma.userprofile.create({
            data: {
              userId: findUser.id,
              address: address,
              dateOfBirth: new Date(dateOfBirth).toISOString(),
              firstName,
              lastName,
              phoneNumber,
              gender,
              image: `/assets/profile/${req.file?.filename}`,
              isAdded: true,
              locationId: createLocation.id,
            },
          });

          return res.status(200).send({
            success: true,
            message: 'successfully add your profile',
            result: createProfile,
          });
        }
      } else {
        return res.status(404).send({
          success: false,
          message: 'Token not found',
          result: res.locals.decrypt.id,
        });
      }
    } catch (error) {
      console.log(error);

      return res.status(500).send({
        success: false,
        message: error,
      });
    }
  }
  async updateProfileUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (res.locals.decrypt.id) {
        const {
          address,
          firstName,
          lastName,
          gender,
          dateOfBirth,
          phoneNumber,
        } = req.body;

        const findUser = await prisma.userprofile.findFirst({
          where: {
            userId: res.locals.decrypt.id,
          },
        });

        if (findUser?.image) {
          const oldImagePath = path.join(
            __dirname,
            '../../public',
            findUser.image,
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }

        const updatedProfile = await prisma.userprofile.update({
          data: {
            address: address ? address : findUser?.address,
            firstName: firstName ? firstName : findUser?.firstName,
            lastName: lastName ? lastName : findUser?.lastName,
            gender: gender ? gender : findUser?.gender,
            phoneNumber: phoneNumber ? phoneNumber : findUser?.phoneNumber,
            dateOfBirth: dateOfBirth
              ? new Date(dateOfBirth).toISOString()
              : findUser?.dateOfBirth,
            image: req.file
              ? `/assets/profile/${req.file?.filename}`
              : findUser?.image,
          },
          where: {
            id: findUser?.id,
          },
        });

        return res.status(200).send({
          success: false,
          message: 'Profile updated succesfully',
          result: updatedProfile,
        });
      }
    } catch (error) {
      next({
        success: false,
        message: 'Cannot update your profile',
        error,
      });
    }
  }
}
