import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.authenticateUser(email, password);
      
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      res.json({ user });
    } catch (error) {
      res.status(500).json({ error: "Authentication failed" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, fullName, department, role } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getProfileByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }
      
      const user = await storage.createProfile({
        email,
        password,
        fullName,
        department,
        role: role || 'operator'
      });
      
      res.json({ user });
    } catch (error) {
      res.status(500).json({ error: "Registration failed" });
    }
  });

  // Quality tests routes
  app.get("/api/quality-tests", async (req, res) => {
    try {
      const tests = await storage.getQualityTests();
      res.json(tests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch quality tests" });
    }
  });

  app.post("/api/quality-tests", async (req, res) => {
    try {
      const test = await storage.createQualityTest(req.body);
      res.json(test);
    } catch (error) {
      res.status(500).json({ error: "Failed to create quality test" });
    }
  });

  app.put("/api/quality-tests/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const test = await storage.updateQualityTest(id, req.body);
      res.json(test);
    } catch (error) {
      res.status(500).json({ error: "Failed to update quality test" });
    }
  });

  // Production lots routes
  app.get("/api/production-lots", async (req, res) => {
    try {
      const lots = await storage.getProductionLots();
      res.json(lots);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch production lots" });
    }
  });

  app.post("/api/production-lots", async (req, res) => {
    try {
      const lot = await storage.createProductionLot(req.body);
      res.json(lot);
    } catch (error) {
      res.status(500).json({ error: "Failed to create production lot" });
    }
  });

  // Energy consumption routes
  app.get("/api/energy-consumption", async (req, res) => {
    try {
      const records = await storage.getEnergyConsumption();
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch energy consumption" });
    }
  });

  app.post("/api/energy-consumption", async (req, res) => {
    try {
      const record = await storage.createEnergyRecord(req.body);
      res.json(record);
    } catch (error) {
      res.status(500).json({ error: "Failed to create energy record" });
    }
  });

  // Waste records routes
  app.get("/api/waste-records", async (req, res) => {
    try {
      const records = await storage.getWasteRecords();
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch waste records" });
    }
  });

  app.post("/api/waste-records", async (req, res) => {
    try {
      const record = await storage.createWasteRecord(req.body);
      res.json(record);
    } catch (error) {
      res.status(500).json({ error: "Failed to create waste record" });
    }
  });

  // Compliance documents routes
  app.get("/api/compliance-documents", async (req, res) => {
    try {
      const documents = await storage.getComplianceDocuments();
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch compliance documents" });
    }
  });

  app.post("/api/compliance-documents", async (req, res) => {
    try {
      const document = await storage.createComplianceDocument(req.body);
      res.json(document);
    } catch (error) {
      res.status(500).json({ error: "Failed to create compliance document" });
    }
  });

  // Testing campaigns routes
  app.get("/api/testing-campaigns", async (req, res) => {
    try {
      const campaigns = await storage.getTestingCampaigns();
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch testing campaigns" });
    }
  });

  app.post("/api/testing-campaigns", async (req, res) => {
    try {
      const campaign = await storage.createTestingCampaign(req.body);
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ error: "Failed to create testing campaign" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
