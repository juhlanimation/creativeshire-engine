/**
 * Validator Registry
 *
 * Barrel file for all validators.
 * Import and register validators here as they are created.
 */

import type { Validator } from '../types'
import { cmsCustomizationValidator } from './cms-customization'
import { containerIndependenceValidator } from './container-independence'
import { cssStandardsValidator } from './css-standards'
import { dataBindingValidator } from './data-binding'
import { fileStructureValidator } from './file-structure'
import { registryComplianceValidator } from './registry-compliance'

/**
 * All registered validators
 */
export const validators: Validator[] = [
  fileStructureValidator,
  dataBindingValidator,
  cmsCustomizationValidator,
  cssStandardsValidator,
  containerIndependenceValidator,
  registryComplianceValidator,
]
