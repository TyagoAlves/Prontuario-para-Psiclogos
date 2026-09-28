import { test, expect } from '@playwright/test';

const errors: string[] = [];

test.beforeEach(async ({ page }) => {
  errors.length = 0;
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
});

async function login(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.locator('#email').fill('ana@clinica.com.br');
  await page.locator('#password').fill('123456');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test('o seed cria pacientes e o painel mostra os totais', async ({ page }) => {
  await login(page);
  await expect(page.getByText('Total de Pacientes')).toBeVisible();

  const totalCard = page.locator('.metrics-grid > *').first();
  await expect(totalCard).toContainText('3');
  expect(errors).toEqual([]);
});

test('a lista de pacientes mostra os registros do seed e filtra por busca', async ({ page }) => {
  await login(page);
  await page.getByRole('link', { name: 'Pacientes' }).click();

  await expect(page.getByText('Juliana Martins')).toBeVisible();
  await expect(page.getByText('Rafael Duarte')).toBeVisible();
  await expect(page.getByText('Beatriz Rocha')).toBeVisible();

  const search = page.getByPlaceholder('Buscar por nome, telefone ou email...');
  await search.fill('Rafael');
  await expect(page.getByText('Rafael Duarte')).toBeVisible();
  await expect(page.getByText('Juliana Martins')).toBeHidden();
  expect(errors).toEqual([]);
});

test('servicos do seed sao listados', async ({ page }) => {
  await login(page);
  await page.getByRole('link', { name: 'Serviços' }).click();
  await expect(page.getByText('Terapia Individual')).toBeVisible();
  await expect(page.getByText('Avaliação Psicológica')).toBeVisible();
  expect(errors).toEqual([]);
});

test('salvar a identidade da clinica no admin persiste e atualiza o branding', async ({ page }) => {
  await login(page);
  await page.getByRole('link', { name: 'Configurações' }).click();
  await expect(page.getByRole('heading', { level: 1, name: /Configura/i })).toBeVisible();

  // aba Identidade
  await page.getByLabel('Nome da Clínica *').fill('Clínica Teste E2E');
  await page.getByRole('button', { name: 'Salvar Identidade' }).click();
  await expect(page.getByText('Identidade atualizado com sucesso')).toBeVisible();
  // a sidebar reflete o novo nome sem recarregar
  await expect(page.locator('.sidebar-title strong')).toHaveText('Clínica Teste E2E');

  // aba Marca -> branding aplicado no documento
  await page.getByRole('button', { name: 'Marca' }).click();
  await page.getByLabel('Cor Principal').fill('#ff0000');
  await page.getByLabel('Sigla (até 3 letras)').fill('CT');
  await page.getByRole('button', { name: 'Salvar Marca' }).click();
  await expect(page.getByText('Marca atualizado com sucesso')).toBeVisible();

  await expect
    .poll(() => page.evaluate(() => document.documentElement.style.getPropertyValue('--primary')))
    .toBe('#ff0000');

  // persiste apos recarregar
  await page.reload();
  await expect(page.locator('.sidebar-title strong')).toHaveText('Clínica Teste E2E');
  await page.getByRole('button', { name: 'Marca' }).click();
  await expect(page.getByLabel('Sigla (até 3 letras)')).toHaveValue('CT');

  expect(errors).toEqual([]);
});

test('os modelos LGPD em JSON sao validados e persistidos', async ({ page }) => {
  await login(page);
  await page.getByRole('link', { name: 'Configurações' }).click();
  await page.getByRole('button', { name: 'Termos LGPD' }).click();

  await page.getByLabel('Modelo de Tratamento (JSON)').fill('{ nao é json }');
  await page.getByRole('button', { name: 'Salvar Modelos LGPD' }).click();
  await expect(page.getByText('JSON dos modelos inválido')).toBeVisible();

  const model = { label: 'T', title: 'T', version: '1.0', blocks: [{ type: 'paragraph', text: 'oi' }] };
  await page.getByLabel('Modelo de Tratamento (JSON)').fill(JSON.stringify(model, null, 2));
  await page.getByRole('button', { name: 'Salvar Modelos LGPD' }).click();
  await expect(page.getByText('Termos LGPD atualizado com sucesso')).toBeVisible();

  await page.reload();
  await page.getByRole('button', { name: 'Termos LGPD' }).click();
  await expect(page.getByLabel('Modelo de Tratamento (JSON)')).toHaveValue(JSON.stringify(model, null, 2));
});

test('usuario nao-admin nao acessa a pagina de administracao', async ({ page }) => {
  await page.goto('/login');
  await page.locator('#email').fill('marcos@clinica.com.br');
  await page.locator('#password').fill('123456');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page).toHaveURL(/\/dashboard/);

  await page.goto('/admin');
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByRole('link', { name: 'Configurações' })).toHaveCount(0);
});
