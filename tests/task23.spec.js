import { test, expect } from '@playwright/test';
import { SignUpForm } from '../poms/pages';
import { ERROR_MESSAGES, PASSWORDS, NAMES, EMAILS } from '../test_data';
import { generateAqaEmail, showErrorMessage } from '../helpers';

let signUpForm;

test.describe('User Registration Form', () => {
  test.beforeEach(async ({ page }) => {
    signUpForm = new SignUpForm(page);
    await page.goto('/');
    await signUpForm.openRegistrationForm();
  });

  test('should display the Registration title', async () => {
    await expect(signUpForm.registrationLabel).toBeVisible();
  });

  test.describe('Validating the Name field', () => {
    test('should not show validation errors for a valid Name', async () => {
      await signUpForm.fillName(NAMES.nameValid);
      await showErrorMessage(signUpForm.signUpFormNameInput, false);
    });

    test('should show an error for an empty Name field', async () => {
      await showErrorMessage(signUpForm.signUpFormNameInput, true, ERROR_MESSAGES.nameEmpty);
    });

    test('should show an error for Name with non-English characters', async () => {
      await signUpForm.fillName(NAMES.nameInvalidSymbols);
      await showErrorMessage(signUpForm.signUpFormNameInput, true, ERROR_MESSAGES.nameInvalid);
    });

    test('should show an error for Name shorter than the minimum length', async () => {
      await signUpForm.fillName(NAMES.nameShort);
      await showErrorMessage(signUpForm.signUpFormNameInput, true, ERROR_MESSAGES.nameInvalidLength);
    });

    test('should show an error for Name exceeding the maximum length', async () => {
      await signUpForm.fillName(NAMES.nameLong);
      await showErrorMessage(signUpForm.signUpFormNameInput, true, ERROR_MESSAGES.nameInvalidLength);
    });
  });

  test.describe('Validating the Last Name field', () => {
    test('should not show validation errors for a valid Last Name', async () => {
      await signUpForm.fillLastName(NAMES.nameValid);
      await showErrorMessage(signUpForm.signUpFormLastNameInput, false);
    });

    test('should show an error for an empty Last Name field', async () => {
      await showErrorMessage(signUpForm.signUpFormLastNameInput, true, ERROR_MESSAGES.lastNameEmpty);
    });

    test('should show an error for Last Name with non-English characters', async () => {
      await signUpForm.fillLastName(NAMES.nameInvalidSymbols);
      await showErrorMessage(signUpForm.signUpFormLastNameInput, true, ERROR_MESSAGES.lastNameInvalid);
    });

    test('should show an error for Last Name shorter than the minimum length', async () => {
      await signUpForm.fillLastName(NAMES.nameShort);
      await showErrorMessage(signUpForm.signUpFormLastNameInput, true, ERROR_MESSAGES.lastNameInvalidLength);
    });

    test('should show an error for Last Name exceeding the maximum length', async () => {
      await signUpForm.fillLastName(NAMES.nameLong);
      await showErrorMessage(signUpForm.signUpFormLastNameInput, true, ERROR_MESSAGES.lastNameInvalidLength);
    });
  });

  test.describe('Validating the Email field', () => {
    test('should not show validation errors for a valid Email', async () => {
      await signUpForm.fillEmail(EMAILS.emailValid);
      await showErrorMessage(signUpForm.signUpFormEmailInput, false);
    });

    test('should show an error for an empty Email field', async () => {
      await showErrorMessage(signUpForm.signUpFormEmailInput, true, ERROR_MESSAGES.emailEmpty);
    });

    test('should show an error for an invalid Email format', async () => {
      await signUpForm.fillEmail(EMAILS.emailInvalid);
      await showErrorMessage(signUpForm.signUpFormEmailInput, true, ERROR_MESSAGES.emailInvalid);
    });
  });

  test.describe('Validating the Password field', () => {
    test('should not show validation errors for a valid Password', async () => {
      await signUpForm.fillPassword(PASSWORDS.passwordValid);
      await showErrorMessage(signUpForm.signUpFormPasswordInput, false);
    });

    test('should show an error for an empty Password field', async () => {
      await showErrorMessage(signUpForm.signUpFormPasswordInput, true, ERROR_MESSAGES.passwordEmpty);
    });

    test('should show an error for an invalid Email format', async () => {
      await signUpForm.fillPassword(PASSWORDS.passwordNoNumber);
      await showErrorMessage(signUpForm.signUpFormPasswordInput, true, ERROR_MESSAGES.passwordInvalid);
    });

    test('should show an error for a Password longer than 15 characters without an uppercase letter', async () => {
      await signUpForm.fillPassword(PASSWORDS.passwordNoUppercase);
      await showErrorMessage(signUpForm.signUpFormPasswordInput, true, ERROR_MESSAGES.passwordInvalid);
    });
  });

  test.describe('Validating the Re-enter Password field', () => {
    test('should not show validation errors when Passwords match', async () => {
      await signUpForm.fillPassword(PASSWORDS.passwordValid);
      await signUpForm.fillRepeatPassword(PASSWORDS.passwordValid);
      await showErrorMessage(signUpForm.signUpFormRepeatPasswordInput, false);
    });

    test('should show an error when Passwords do not match', async () => {
      await signUpForm.fillPassword(PASSWORDS.passwordValid);
      await signUpForm.fillRepeatPassword(PASSWORDS.passwordRepeatInvalid);
      await showErrorMessage(signUpForm.signUpFormRepeatPasswordInput, true, ERROR_MESSAGES.passwordRepeatInvalid);
    });

    test('should show an error for an empty Re-enter Password field', async () => {
      await signUpForm.fillPassword(PASSWORDS.passwordValid);
      await showErrorMessage(signUpForm.signUpFormRepeatPasswordInput, true, ERROR_MESSAGES.passwordRepeatEmpty);
    });
  });

  test.describe('Register Button Behavior', () => {
    test('should disable the Register button when all fields are empty', async () => {
      await expect(signUpForm.signUpFormRegisterButton).toBeDisabled();
    });

    test('should disable the Register button when some fields have errors', async () => {
      await signUpForm.fillName(NAMES.nameShort);
      await signUpForm.fillLastName(NAMES.nameShort);
      await signUpForm.fillEmail(EMAILS.emailInvalid);
      await signUpForm.fillPassword(PASSWORDS.passwordNoNumber);
      await signUpForm.fillRepeatPassword(PASSWORDS.passwordRepeatInvalid);
      await signUpForm.signUpFormRepeatPasswordInput.blur();
      await expect(signUpForm.signUpFormRegisterButton).toBeDisabled();
    });

    test('should enable the Register button when all fields are valid and successfully register a user', async ({ page }) => {
      await signUpForm.fillName(NAMES.nameValid);
      await signUpForm.fillLastName(NAMES.nameValid);
      await signUpForm.fillEmail(generateAqaEmail(EMAILS.emailValid));
      await signUpForm.fillPassword(PASSWORDS.passwordValid);
      await signUpForm.fillRepeatPassword(PASSWORDS.passwordValid);
      await expect(signUpForm.signUpFormRegisterButton).not.toBeDisabled();
      await signUpForm.clickRegisterButton();
      await expect(page.getByText('Registration complete')).toBeVisible();
      await expect(page).toHaveURL(/\/panel\/garage/);
    });
  });
});
