import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from './dto';
import { JwtPayload } from '@/common/interfaces';

// Prisma will be injected when available
// For now, this is a placeholder structure

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    // private prisma: PrismaService, // Will be added when Prisma is working
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, phone, password, firstName, lastName } = registerDto;

    // Validate that at least email or phone is provided
    if (!email && !phone) {
      throw new BadRequestException('Email or phone number is required');
    }

    // Check if user already exists (mock for now)
    // const existingUser = await this.prisma.user.findFirst({
    //   where: { OR: [{ email }, { phone }] },
    // });
    // if (existingUser) {
    //   throw new ConflictException('User already exists');
    // }

    // Hash password
    const hashedPassword = await this.hashPassword(password);

    // Create user (mock for now)
    const user = {
      id: 'mock-user-id',
      email,
      phone,
      passwordHash: hashedPassword,
      firstName,
      lastName,
      role: 'CUSTOMER',
      emailVerified: false,
      phoneVerified: false,
      isActive: true,
    };

    // const newUser = await this.prisma.user.create({
    //   data: {
    //     email,
    //     phone,
    //     passwordHash: hashedPassword,
    //     firstName,
    //     lastName,
    //     role: 'CUSTOMER',
    //   },
    // });

    // Generate tokens
    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, phone, password } = loginDto;

    if (!email && !phone) {
      throw new BadRequestException('Email or phone number is required');
    }

    // Find user (mock for now)
    // const user = await this.prisma.user.findFirst({
    //   where: { OR: [{ email }, { phone }] },
    // });

    const user = {
      id: 'mock-user-id',
      email: email || 'user@example.com',
      phone,
      passwordHash: await this.hashPassword('password123'),
      role: 'CUSTOMER',
      isActive: true,
    };

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await this.verifyPassword(
      password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Update last login (mock for now)
    // await this.prisma.user.update({
    //   where: { id: user.id },
    //   data: { lastLoginAt: new Date() },
    // });

    // Generate tokens
    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('jwt.secret'),
      });

      // Check if refresh token exists in database (mock for now)
      // const storedToken = await this.prisma.refreshToken.findUnique({
      //   where: { token: refreshToken },
      // });

      // if (!storedToken || storedToken.revokedAt) {
      //   throw new UnauthorizedException('Invalid refresh token');
      // }

      // Generate new tokens
      const tokens = await this.generateTokens({
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
      });

      // Revoke old refresh token and create new one (mock for now)
      // await this.prisma.refreshToken.update({
      //   where: { token: refreshToken },
      //   data: { revokedAt: new Date() },
      // });

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateUser(emailOrPhone: string, password: string): Promise<any> {
    // Find user (mock for now)
    // const user = await this.prisma.user.findFirst({
    //   where: {
    //     OR: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    //   },
    // });

    const user = {
      id: 'mock-user-id',
      email: emailOrPhone,
      passwordHash: await this.hashPassword('password123'),
      role: 'CUSTOMER',
    };

    if (!user) {
      return null;
    }

    const isPasswordValid = await this.verifyPassword(
      password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      return null;
    }

    return this.sanitizeUser(user);
  }

  private async generateTokens(payload: JwtPayload) {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.secret'),
      expiresIn: this.configService.get('jwt.accessTokenExpiry'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.secret'),
      expiresIn: this.configService.get('jwt.refreshTokenExpiry'),
    });

    // Store refresh token in database (mock for now)
    // await this.prisma.refreshToken.create({
    //   data: {
    //     userId: payload.sub,
    //     token: refreshToken,
    //     expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    //   },
    // });

    return {
      accessToken,
      refreshToken,
      expiresIn: this.configService.get('jwt.accessTokenExpiry'),
    };
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  private async verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  private sanitizeUser(user: any) {
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }
}
