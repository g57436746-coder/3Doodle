import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from 'zod';
import { chatRequestSchema, generateImageSchema, GalleryItem } from '@shared/schema';
import { nanoid } from 'nanoid';
import {
  chatWithOpenRouter,
  detectObjectInDrawing,
  generate3DModel,
  getRequestedImageObject,
  isOpenRouterConfigError,
} from './openrouter';

// In-memory storage for generated gallery items
let galleryItems: GalleryItem[] = [];

function createGalleryItem(objectType: string, imageUrl: string): GalleryItem {
  return {
    id: nanoid(),
    objectType,
    imageUrl,
    created: new Date().toISOString()
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // GET all gallery items
  app.get('/api/gallery', (req, res) => {
    res.json(galleryItems);
  });
  
  app.post('/api/chat', async (req, res) => {
    try {
      const validatedData = chatRequestSchema.parse(req.body);
      const requestedObject = getRequestedImageObject(validatedData.messages);

      if (requestedObject) {
        console.log(`Generating 3D model from chat for: ${requestedObject}`);
        const imageUrl = await generate3DModel(requestedObject);
        const newItem = createGalleryItem(requestedObject, imageUrl);
        galleryItems.unshift(newItem);

        return res.status(200).json({
          message: {
            role: 'assistant',
            content: `Done! I made a 3D ${requestedObject} and added it to your gallery.`,
          },
          galleryItem: newItem,
        });
      }

      const content = await chatWithOpenRouter(validatedData.messages);

      res.status(200).json({
        message: {
          role: 'assistant',
          content: content || "I am here to help with your next doodle.",
        },
      });
    } catch (error) {
      console.error('Error chatting with OpenRouter:', error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: 'Invalid chat request data',
          errors: error.errors
        });
      }

      if (isOpenRouterConfigError(error)) {
        return res.status(500).json({
          message: error.message
        });
      }

      res.status(500).json({
        message: 'Failed to send chat message. Please try again.'
      });
    }
  });
  
  // Generate 3D image from a sketch using OpenRouter AI
  app.post('/api/generate', async (req, res) => {
    try {
      // Validate request body
      const validatedData = generateImageSchema.parse(req.body);
      
      // Extract the base64 image data
      const imageData = validatedData.imageData;
      
      // Log processing start
      console.log('Processing drawing to detect object...');
      
      // Detect object type from the sketch using OpenRouter
      const objectType = await detectObjectInDrawing(imageData);
      console.log(`Detected object type: ${objectType}`);
      
      // Generate 3D image using Sourceful Riverflow through OpenRouter
      console.log(`Generating 3D model for: ${objectType}`);
      const imageUrl = await generate3DModel(objectType);
      
      // Create gallery item
      const newItem = createGalleryItem(objectType, imageUrl);
      
      // Store the gallery item in-memory
      galleryItems.unshift(newItem);
      
      console.log(`Successfully created 3D model for ${objectType}`);
      
      // Return the created item
      res.status(201).json(newItem);
    } catch (error) {
      console.error('Error generating 3D image:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: 'Invalid request data', 
          errors: error.errors 
        });
      }

      if (isOpenRouterConfigError(error)) {
        return res.status(500).json({
          message: error.message
        });
      }
      
      res.status(500).json({ 
        message: 'Failed to generate 3D image. Please try again.' 
      });
    }
  });
  
  // Delete a gallery item
  app.delete('/api/gallery/:id', (req, res) => {
    const { id } = req.params;
    
    // Find and remove the item
    const initialLength = galleryItems.length;
    galleryItems = galleryItems.filter(item => item.id !== id);
    
    if (galleryItems.length === initialLength) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    
    res.status(200).json({ message: 'Gallery item deleted successfully' });
  });
  
  // Clear all gallery items
  app.delete('/api/gallery', (req, res) => {
    galleryItems = [];
    res.status(200).json({ message: 'Gallery cleared successfully' });
  });

  const httpServer = createServer(app);
  
  return httpServer;
}
