import z from "zod";
export const ParteBSchema = z.object({
  a_temp: z
    .number({
      error: "La temperatura debe ser un número",
    })
    .default(32),
  a_vib: z
    .number({
      error: "La vibración debe ser un número",
    })
    .default(5),
});

export type ParteBData = z.infer<typeof ParteBSchema>;
