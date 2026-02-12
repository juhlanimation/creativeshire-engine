/**
 * Tab configurations for the DevToolsPanel.
 * Each tab maps to a registry (experience, intro, transition, preset).
 */

import {
  getAllExperienceMetas,
  getExperienceOverride,
  setExperienceOverride,
} from '../../../experience'
import {
  getAllRegisteredIntroMetas,
  getIntroOverride,
  setIntroOverride,
} from '../../../intro/registry'
import {
  getAllRegisteredTransitionMetas,
  getTransitionOverride,
  setTransitionOverride,
} from '../../../experience/transitions/registry'
import {
  getAllPresetMetas,
  getPresetOverride,
  setPresetOverride,
} from '../../../presets/registry'
import type { DevToolsTabConfig, DevToolsItem } from './types'

export const TAB_CONFIGS: DevToolsTabConfig[] = [
  {
    id: 'experience',
    label: 'Experience',
    icon: '\uD83C\uDFAC',
    color: '59,130,246',
    headerTitle: 'Switch Experience',
    urlParam: '_experience',
    mode: 'live',
    eventName: 'experienceOverrideChange',
    getItems: () => getAllExperienceMetas().map((m): DevToolsItem => ({
      id: m.id,
      name: m.name,
      description: m.description,
      settings: m.settings as DevToolsItem['settings'],
    })),
    getOverride: getExperienceOverride,
    setOverride: setExperienceOverride,
  },
  {
    id: 'intro',
    label: 'Intro',
    icon: '\uD83C\uDFAD',
    color: '16,185,129',
    headerTitle: 'Switch Intro',
    urlParam: '_intro',
    mode: 'reload',
    allowNone: true,
    noneLabel: 'No Intro',
    noneDescription: 'Disable intro sequence',
    footerMessage: 'Switching intros reloads the page',
    getItems: () => getAllRegisteredIntroMetas().map((m): DevToolsItem => ({
      id: m.id,
      name: m.name,
      description: m.description,
      settings: m.settings as DevToolsItem['settings'],
    })),
    getOverride: getIntroOverride,
    setOverride: setIntroOverride,
  },
  {
    id: 'transition',
    label: 'Transition',
    icon: '~',
    color: '245,158,11',
    headerTitle: 'Switch Transition',
    urlParam: '_transition',
    mode: 'reload',
    allowNone: true,
    noneLabel: 'No Transition',
    noneDescription: 'Disable page transitions',
    footerMessage: 'Switching transitions reloads the page',
    getItems: () => getAllRegisteredTransitionMetas().map((m): DevToolsItem => ({
      id: m.id,
      name: m.name,
      description: m.description,
    })),
    getOverride: getTransitionOverride,
    setOverride: setTransitionOverride,
  },
  {
    id: 'preset',
    label: 'Preset',
    icon: '\uD83C\uDFA8',
    color: '168,85,247',
    headerTitle: 'Switch Preset',
    urlParam: '_preset',
    mode: 'reload',
    footerMessage: 'Switching presets reloads the page',
    getItems: () => getAllPresetMetas().map((m): DevToolsItem => ({
      id: m.id,
      name: m.name,
      description: m.description,
    })),
    getOverride: getPresetOverride,
    setOverride: setPresetOverride,
  },
]
