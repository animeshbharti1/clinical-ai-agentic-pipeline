import { test, expect } from '@playwright/test';

test.describe('Autonomous Clinical AI Agentic Pipeline E2E Suite', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to local dev server app
    await page.goto('http://localhost:5173/');
  });

  test('1. Should render main application title and workflow diagram', async ({ page }) => {
    // Check main title
    await expect(page.locator('h1')).toContainText('Autonomous Clinical AI Agentic Pipeline');

    // Verify visual workflow nodes exist
    await expect(page.getByText('Ingestion & Extraction Agent')).toBeVisible();
    await expect(page.getByText('Clinical Risk Analysis')).toBeVisible();
    await expect(page.getByText('SOAP Clinical Draft')).toBeVisible();
    await expect(page.getByText('Doctor Approval Gate')).toBeVisible();
  });

  test('2. Should trigger Red Urgent Case Bypass for Critical STEMI Patient', async ({ page }) => {
    // Select Critical STEMI scenario if not selected
    await page.selectOption('select', { label: '🚨 Critical STEMI Chest Pain (Emergency Bypass)' });

    // Verify Urgent Red Bypass Alert banner appears
    await expect(page.getByText('CRITICAL CASE FAST-TRACKED DIRECTLY TO DOCTOR DASHBOARD')).toBeVisible();
    await expect(page.getByText('2.5mm ST-elevation')).toBeVisible();
  });

  test('3. Should extract FHIR fields in Ingestion Agent', async ({ page }) => {
    // Navigate to Ingestion tab
    await page.getByRole('button', { name: 'Teal Ingestion Agent' }).click();

    // Verify extracted basic patient details banner
    await expect(page.getByText('PATIENT NAME')).toBeVisible();
    await expect(page.getByText('AGE & GENDER')).toBeVisible();
    await expect(page.getByText('Chief Complaint')).toBeVisible();
  });

  test('4. Should display Risk Score Gauge in Analysis Agent', async ({ page }) => {
    // Navigate to Analysis tab
    await page.getByRole('button', { name: 'Coral Risk Analysis Agent' }).click();

    // Verify risk score gauge
    await expect(page.getByText('Computed Clinical Risk Score')).toBeVisible();
    await expect(page.getByText('Flagged Abnormality Parameters')).toBeVisible();
  });

  test('5. Should handle Physician Approval and trigger Post-Approval Actions', async ({ page }) => {
    // Navigate to Doctor Approval Gate tab
    await page.getByRole('button', { name: 'Amber Doctor Approval Gate' }).click();

    // Verify centerpiece Doctor Dashboard
    await expect(page.getByText('Human Physician Approval Gatekeeper')).toBeVisible();

    // Enter physician digital signature
    const signatureInput = page.getByPlaceholder('e.g. Dr. Sarah Jenkins, MD');
    await signatureInput.fill('Dr. Sarah Jenkins, MD');

    // Click Approve & Dispatch button
    await page.getByRole('button', { name: /Approve Prescription & Dispatch/i }).click();

    // Verify post-approval dispatch panels and audit log
    await expect(page.getByText('Patient Notification Ticket')).toBeVisible();
    await expect(page.getByText('EHR Record Commit')).toBeVisible();
  });

  test('6. Should handle Draft Rejection and show Rejection Banner', async ({ page }) => {
    // Navigate to Doctor Gate
    await page.getByRole('button', { name: 'Amber Doctor Approval Gate' }).click();

    // Click Reject Draft button
    await page.getByRole('button', { name: /Reject Draft/i }).click();

    // Verify DRAFT REJECTED BY PHYSICIAN alert displays
    await expect(page.getByText('DRAFT REJECTED BY PHYSICIAN')).toBeVisible();
  });

});
