import { Request, Response } from 'express';
export declare const getSavedLocations: (req: Request, res: Response) => Promise<void>;
export declare const createSavedLocation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteSavedLocation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=saved.controller.d.ts.map