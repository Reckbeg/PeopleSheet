import ExcelJS from "exceljs";
import { getTemplate, type TemplateSlug } from "../templates";
import { templateBuilders } from "./builders";
import type { TemplateBuildOptions } from "./shared";

export type { TemplateBuildOptions } from "./shared";

export async function buildTemplateWorkbook(slug: TemplateSlug, options?: TemplateBuildOptions) {
  const template = getTemplate(slug);

  if (!template) {
    throw new Error(`Unknown template: ${slug}`);
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "PeopleSheet";
  workbook.lastModifiedBy = "PeopleSheet";
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.properties.date1904 = false;

  templateBuilders[slug](workbook, template, options);

  const rawBuffer = await workbook.xlsx.writeBuffer();

  return {
    fileName: template.fileName,
    buffer: Buffer.isBuffer(rawBuffer) ? rawBuffer : Buffer.from(rawBuffer),
  };
}
