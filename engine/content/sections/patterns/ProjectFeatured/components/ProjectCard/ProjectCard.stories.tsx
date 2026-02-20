import { patternStoryConfig, patternStoryArgs } from '../../../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import { createProjectCard } from './index'

export default { ...patternStoryConfig(meta, createProjectCard), title: 'Project/Project Featured/Widgets/Project Card' }
export const Default = { args: patternStoryArgs('ProjectCard', meta) }
