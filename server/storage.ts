import { eq } from "drizzle-orm";
import { db } from "./database";
import { 
  users, 
  profiles, 
  qualityTests, 
  productionLots, 
  energyConsumption, 
  wasteRecords, 
  complianceDocuments, 
  testingCampaigns,
  type User, 
  type InsertUser 
} from "@shared/schema";
import bcrypt from "bcrypt";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Profile methods
  getProfile(id: string): Promise<any>;
  getProfileByEmail(email: string): Promise<any>;
  createProfile(profile: any): Promise<any>;
  updateProfile(id: string, updates: any): Promise<any>;
  
  // Authentication methods
  authenticateUser(email: string, password: string): Promise<any>;
  hashPassword(password: string): Promise<string>;
  
  // Quality tests methods
  getQualityTests(): Promise<any[]>;
  createQualityTest(test: any): Promise<any>;
  updateQualityTest(id: string, updates: any): Promise<any>;
  
  // Production lots methods
  getProductionLots(): Promise<any[]>;
  createProductionLot(lot: any): Promise<any>;
  
  // Energy consumption methods
  getEnergyConsumption(): Promise<any[]>;
  createEnergyRecord(record: any): Promise<any>;
  
  // Waste records methods
  getWasteRecords(): Promise<any[]>;
  createWasteRecord(record: any): Promise<any>;
  
  // Documents methods
  getComplianceDocuments(): Promise<any[]>;
  createComplianceDocument(document: any): Promise<any>;
  
  // Testing campaigns methods
  getTestingCampaigns(): Promise<any[]>;
  createTestingCampaign(campaign: any): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // Legacy user methods for compatibility
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Authentication methods
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async authenticateUser(email: string, password: string): Promise<any> {
    const result = await db.select().from(profiles).where(eq(profiles.email, email));
    const profile = result[0];
    
    if (!profile) return null;
    
    const isValid = await bcrypt.compare(password, profile.password);
    if (!isValid) return null;
    
    // Don't return password in response
    const { password: _, ...profileWithoutPassword } = profile;
    return profileWithoutPassword;
  }

  // Profile methods
  async getProfile(id: string): Promise<any> {
    const result = await db.select().from(profiles).where(eq(profiles.id, id));
    return result[0];
  }

  async getProfileByEmail(email: string): Promise<any> {
    const result = await db.select().from(profiles).where(eq(profiles.email, email));
    return result[0];
  }

  async createProfile(profile: any): Promise<any> {
    const hashedPassword = await this.hashPassword(profile.password);
    const profileData = { ...profile, password: hashedPassword };
    const result = await db.insert(profiles).values(profileData).returning();
    const { password, ...profileWithoutPassword } = result[0];
    return profileWithoutPassword;
  }

  async updateProfile(id: string, updates: any): Promise<any> {
    if (updates.password) {
      updates.password = await this.hashPassword(updates.password);
    }
    const result = await db.update(profiles).set(updates).where(eq(profiles.id, id)).returning();
    const { password, ...profileWithoutPassword } = result[0];
    return profileWithoutPassword;
  }

  // Quality tests methods
  async getQualityTests(): Promise<any[]> {
    return await db.select().from(qualityTests);
  }

  async createQualityTest(test: any): Promise<any> {
    const result = await db.insert(qualityTests).values(test).returning();
    return result[0];
  }

  async updateQualityTest(id: string, updates: any): Promise<any> {
    const result = await db.update(qualityTests).set(updates).where(eq(qualityTests.id, id)).returning();
    return result[0];
  }

  // Production lots methods
  async getProductionLots(): Promise<any[]> {
    return await db.select().from(productionLots);
  }

  async createProductionLot(lot: any): Promise<any> {
    const result = await db.insert(productionLots).values(lot).returning();
    return result[0];
  }

  // Energy consumption methods
  async getEnergyConsumption(): Promise<any[]> {
    return await db.select().from(energyConsumption);
  }

  async createEnergyRecord(record: any): Promise<any> {
    const result = await db.insert(energyConsumption).values(record).returning();
    return result[0];
  }

  // Waste records methods
  async getWasteRecords(): Promise<any[]> {
    return await db.select().from(wasteRecords);
  }

  async createWasteRecord(record: any): Promise<any> {
    const result = await db.insert(wasteRecords).values(record).returning();
    return result[0];
  }

  // Documents methods
  async getComplianceDocuments(): Promise<any[]> {
    return await db.select().from(complianceDocuments);
  }

  async createComplianceDocument(document: any): Promise<any> {
    const result = await db.insert(complianceDocuments).values(document).returning();
    return result[0];
  }

  // Testing campaigns methods
  async getTestingCampaigns(): Promise<any[]> {
    return await db.select().from(testingCampaigns);
  }

  async createTestingCampaign(campaign: any): Promise<any> {
    const result = await db.insert(testingCampaigns).values(campaign).returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
