import { test, expect } from '@playwright/test';

const URL ='https://demoqa.com/automation-practice-form';
const student = {
	firstName: 'Rodrigo',
	lastName: 'Barrios',
	email: 'rodrigoedu11@gmail.com',
	mobile: '9893639670',
	state: 'Rajasthan',
	city: 'Jaipur',
	dateBirth: '11 May 2022',
	address: 'Jr. Rodolfo Rutte 293',
	picture: '../media/Arch_Linux_Icon.png',
	gender: /^Male$/,
	hobbies: ['reading']
};


test.describe.skip('Practice Form', () => {

	test.beforeEach('Go to page', async ({ page }) => {
		await page.goto(URL);
		await expect(page.getByRole('heading', {name: 'Practice Form'})).toBeVisible();
	});

	test('Fill out form', async ({ page }) => {
		await page.getByPlaceholder('First Name').fill(student.firstName);
		await page.getByPlaceholder('Last Name').fill(student.lastName);
		await page.getByPlaceholder('name@example.com').fill(student.email);
		await page.locator('label', { hasText: student.gender}).click();
		await page.getByPlaceholder('Mobile number').fill(student.mobile);
		await page.locator('#dateOfBirthInput').fill(student.dateBirth);
		await page.locator('#subjectsInput').fill('Parkour');
		for (const hobbie of student.hobbies) {
			await page.locator('label', { hasText: hobbie}).click();
		}
		await page.getByLabel('Select picture').setInputFiles(student.picture);
		await page.getByPlaceholder('Current Address').fill(student.address);
		async function selectReactOption(containerId: string, value: string) {
			await page.locator(`#${containerId}`).click();
			await page.keyboard.type(value);
			await page.keyboard.press('Enter');
		}
		await selectReactOption('state', student.state);
		await selectReactOption('city', student.city);
		await page.getByRole('button', { name: 'Submit'}).click();
		await expect(page.getByText('Thanks for submitting the form')).toBeVisible();
		await page.getByRole('button', { name: 'Close' }).click({force: true});
	});
});