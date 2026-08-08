import { test, expect } from '@playwright/test';

test.describe('Autonomous Clinical AI Agentic Pipeline E2E Suite', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to local dev server app
    await page.goto('http://localhost:5173/');
  });

  test('1. Should render main application title and workflow diagram', async ({ page }) => {
    // Check main logo title
    await expect(page.locator('h1')).toContainText('ClinicaAI');

    // Verify visual workflow diagram title and nodes exist
    await expect(page.getByText('Autonomous Clinical Workflow Pipeline')).toBeVisible();
    await expect(page.getByText('02. Ingestion & Extraction Agent')).toBeVisible();
    await expect(page.getByText('03. Clinical Risk Analysis Agent')).toBeVisible();
    await expect(page.getByText('04. Clinical SOAP Note & Draft Agent')).toBeVisible();
    await expect(page.getByText('05. Doctor Review Dashboard')).toBeVisible();
  });

  test('2. Should trigger Red Urgent Case Bypass for Critical STEMI Patient', async ({ page }) => {
    // Select Critical STEMI scenario by index 0
    await page.selectOption('select', { index: 0 });

    // Navigate to Doctor Gate tab to view urgent bypass alert
    await page.getByRole('button', { name: /Doctor Approval/i }).click();

    // Verify Urgent Red Bypass Alert banner appears
    await expect(page.getByText('URGENT BYPASS NOTICE')).toBeVisible();
  });

  test('3. Should extract FHIR fields in Ingestion Agent', async ({ page }) => {
    // Navigate to Ingestion tab
    await page.getByRole('button', { name: /Ingestion Agent/i }).click();

    // Verify extracted basic patient details banner
    await expect(page.getByText('PATIENT NAME')).toBeVisible();
    await expect(page.getByText('AGE & GENDER')).toBeVisible();
    await expect(page.getByText('Chief Complaint')).toBeVisible();
  });

  test('4. Should display Risk Score Gauge in Analysis Agent', async ({ page }) => {
    // Navigate to Analysis tab
    await page.getByRole('button', { name: /Analysis Agent/i }).click();

    // Verify risk score gauge and flagged abnormalities header
    await expect(page.getByText('Computed Clinical Risk Score')).toBeVisible();
    await expect(page.getByText('Flagged Abnormalities & Clinical Context')).toBeVisible();
  });

  test('5. Should handle Physician Approval and trigger Post-Approval Actions', async ({ page }) => {
    // Navigate to Doctor Approval Gate tab
    await page.getByRole('button', { name: /Doctor Approval/i }).click();

    // Verify centerpiece Doctor Dashboard
    await expect(page.getByText('Doctor Review Dashboard')).toBeVisible();

    // Enter physician digital signature
    const signatureInput = page.locator('input[value*="Dr. Sarah Jenkins"]');
    await expect(signatureInput).toBeVisible();

    // Click Approve & Dispatch button
    await page.getByRole('button', { name: /APPROVE & DISPATCH/i }).click();

    // Verify post-approval dispatch panels and audit log
    await expect(page.getByText('Post-Approval Action Execution')).toBeVisible();
    await expect(page.getByText('1. Notify Patient')).toBeVisible();
    await expect(page.getByText('2. Update EHR Record')).toBeVisible();
  });

  test('6. Should handle Draft Rejection and show Rejection Banner', async ({ page }) => {
    // Navigate to Doctor Gate
    await page.getByRole('button', { name: /Doctor Approval/i }).click();

    // Click Reject Draft button
    await page.getByRole('button', { name: /Reject Draft/i }).click();

    // Verify DRAFT REJECTED BY PHYSICIAN alert displays
    await expect(page.getByText('DRAFT REJECTED BY PHYSICIAN')).toBeVisible();
  });

});
