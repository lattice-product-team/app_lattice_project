export declare function findRoute(origin: {
    lat?: number;
    lng?: number;
    poiId?: number;
}, destination: {
    lat?: number;
    lng?: number;
    poiId?: number;
}, options?: {
    avoidStairs?: boolean;
    wheelchairAccess?: boolean;
    eventId?: number;
}): Promise<{
    type: string;
    geometry: {
        type: string;
        coordinates: any[];
    };
    properties: {
        distance: number;
        durationEstimate: number;
    };
}>;
//# sourceMappingURL=navigation.service.d.ts.map