import { describe, it, expect, vi } from 'vitest';
import { handleResponse } from '../apiClient';

describe('apiClient handleResponse', () => {
  it('successfully returns data for 2xx responses', async () => {
    const mockData = { id: 1, name: 'Test' };
    const mockResponse = {
      ok: true,
      status: 200,
      json: async () => mockData,
    } as Response;

    const result = await handleResponse(mockResponse);
    expect(result).toEqual(mockData);
  });

  it('extracts error from structured nested message', async () => {
    const mockError = { error: { message: 'Nested error message' } };
    const mockResponse = {
      ok: false,
      status: 400,
      url: 'http://test.com',
      json: async () => mockError,
    } as Response;

    await expect(handleResponse(mockResponse)).rejects.toThrow('Nested error message');
  });

  it('extracts error from legacy user_friendly_message', async () => {
    const mockError = { error: { user_friendly_message: 'Legacy error message' } };
    const mockResponse = {
      ok: false,
      status: 400,
      url: 'http://test.com',
      json: async () => mockError,
    } as Response;

    await expect(handleResponse(mockResponse)).rejects.toThrow('Legacy error message');
  });

  it('extracts error from flat string error property', async () => {
    const mockError = { error: 'Flat string error message' };
    const mockResponse = {
      ok: false,
      status: 404,
      url: 'http://test.com',
      json: async () => mockError,
    } as Response;

    await expect(handleResponse(mockResponse)).rejects.toThrow('Flat string error message');
  });

  it('extracts error from top-level message property', async () => {
    const mockError = { message: 'Top-level error message' };
    const mockResponse = {
      ok: false,
      status: 500,
      url: 'http://test.com',
      json: async () => mockError,
    } as Response;

    await expect(handleResponse(mockResponse)).rejects.toThrow('Top-level error message');
  });

  it('falls back to default message if no error information found', async () => {
    const mockError = {};
    const mockResponse = {
      ok: false,
      status: 502,
      url: 'http://test.com',
      json: async () => mockError,
    } as Response;

    await expect(handleResponse(mockResponse)).rejects.toThrow('Unexpected server error');
  });
});
