import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const SPORTS_TYPES = ["Cricket", "Football", "Basketball", "Badminton"] as const;
const SLOT_DURATIONS = [30, 60, 90, 120] as const;

// multipart/form-data sends everything as strings, so numeric / array / boolean
// fields need coercion + parsing before they hit the zod checks below.
const csvToArray = (val: unknown) => {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    return val
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return val;
};


export const createTurfSchema = z.object({
  body: z.object({
    turfName: z
      .string({ error: "turfName is required" })
      .trim()
      .min(3, "turfName must be at least 3 characters")
      .max(150, "turfName must be at most 150 characters"),
    description: z
      .string({ error: "description is required" })
      .trim()
      .min(20, "description must be at least 20 characters")
      .max(500, "description must be at most 500 characters"),
    address: z.string({ error: "address is required" }).trim().min(1),
    city: z.string({ error: "city is required" }).trim().min(1),
    longitude: z.coerce
      .number({ error: "longitude is required" })
      .min(-180)
      .max(180),
    latitude: z.coerce
      .number({ error: "latitude is required" })
      .min(-90)
      .max(90),
    sportsType: z
      .preprocess(csvToArray, z.array(z.enum(SPORTS_TYPES)))
      .refine((arr) => arr.length > 0, "At least one sportsType is required"),
    openingTime: z
      .string({ error: "openingTime is required" })
      .regex(timeRegex, "openingTime must be in HH:mm 24hr format"),
    closingTime: z
      .string({ error: "closingTime is required" })
      .regex(timeRegex, "closingTime must be in HH:mm 24hr format"),
    slotDuration: z.coerce
      .number({ error: "slotDuration is required" })
      .refine(
        (val) => (SLOT_DURATIONS as readonly number[]).includes(val),
        `slotDuration must be one of ${SLOT_DURATIONS.join(", ")}`
      ),
    pricePerSlot: z.coerce
      .number({ error: "pricePerSlot is required" })
      .min(0, "pricePerSlot cannot be negative"),
    amenities: z.preprocess(csvToArray, z.array(z.string().trim().min(1))).optional(),
  }).refine((data) => data.openingTime !== data.closingTime, {
    message: "openingTime and closingTime cannot be the same",
    path: ["closingTime"],
  }),
});

export const updateTurfSchema = z.object({
  body: z
    .object({
      turfName: z.string().trim().min(3).max(150).optional(),
      description: z.string().trim().min(20).max(500).optional(),
      address: z.string().trim().min(1).optional(),
      city: z.string().trim().min(1).optional(),
      longitude: z.coerce.number().min(-180).max(180).optional(),
      latitude: z.coerce.number().min(-90).max(90).optional(),
      sportsType: z.preprocess(csvToArray, z.array(z.enum(SPORTS_TYPES))).optional(),
      openingTime: z.string().regex(timeRegex).optional(),
      closingTime: z.string().regex(timeRegex).optional(),
      slotDuration: z.coerce
        .number()
        .refine((val) => (SLOT_DURATIONS as readonly number[]).includes(val))
        .optional(),
      pricePerSlot: z.coerce.number().min(0).optional(),
      amenities: z.preprocess(csvToArray, z.array(z.string().trim().min(1))).optional(),
      // public_ids of existing images the owner wants removed on this update
      removeImageIds: z.preprocess(csvToArray, z.array(z.string())).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided to update",
    }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid turf id"),
  }),
});

export const turfIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid turf id"),
  }),
});

export const updateTurfStatusSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid turf id"),
  }),
  body: z.object({
    status: z.enum(["active", "inactive"], {
      error: "status is required",
    }),
  }),
});

export const listTurfsQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(50).optional().default(10),
    city: z.string().trim().optional(),
    sportsType: z.enum(SPORTS_TYPES).optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    status: z.enum(["active", "inactive"]).optional(),
    // geo search: find turfs within `radiusKm` of lng,lat
    lng: z.coerce.number().min(-180).max(180).optional(),
    lat: z.coerce.number().min(-90).max(90).optional(),
    radiusKm: z.coerce.number().min(0.1).max(200).optional(),
    sortBy: z.enum(["price", "rating", "createdAt"]).optional().default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  }),
});

export type CreateTurfInput = z.infer<typeof createTurfSchema>["body"];
export type UpdateTurfInput = z.infer<typeof updateTurfSchema>["body"];
export type ListTurfsQuery = z.infer<typeof listTurfsQuerySchema>["query"];
