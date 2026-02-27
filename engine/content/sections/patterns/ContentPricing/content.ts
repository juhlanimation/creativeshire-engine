import type { SectionContentDeclaration } from '../../../../schema/content-field'
import type { ContentPricingProps } from './types'

export const content: SectionContentDeclaration<Partial<ContentPricingProps>> = {
  label: 'Pricing',
  description: 'Feature comparison cards with pricing tiers.',
  contentFields: [
    { path: 'subtitle', type: 'text', label: 'Price Subtitle', default: 'ex moms / måned' },
    {
      path: 'plans',
      type: 'collection',
      label: 'Pricing Plans',
      required: true,
      itemFields: [
        { path: 'name', type: 'text', label: 'Plan Name', required: true },
        { path: 'price', type: 'text', label: 'Price', required: true },
        { path: 'description', type: 'textarea', label: 'Description' },
        {
          path: 'features',
          type: 'collection',
          label: 'Features',
          itemFields: [
            { path: 'label', type: 'text', label: 'Feature Name', required: true },
            { path: 'included', type: 'text', label: 'Included (true/false/partial)', required: true },
          ],
        },
      ],
    },
    { path: 'footerText', type: 'text', label: 'Footer Text' },
  ],
  sampleContent: {
    subtitle: 'ex moms / måned',
    plans: [
      {
        id: 'flex',
        name: 'FLEX',
        price: '1.300 DKK',
        description: 'Frihed og fleksibilitet.\nBetal kun for adgang, ikke for plads.',
        features: [
          { label: 'Fri adgang 24/7', included: true },
          { label: 'Egen nøgle', included: true },
          { label: 'Wi-Fi (1000 Mbit)', included: true },
          { label: 'Egen fast plads', included: false },
          { label: 'Reol plads', included: false },
        ],
      },
      {
        id: 'all-in',
        name: 'ALL-IN',
        price: '2.000 DKK',
        description: 'Dit second home.\nFast plads uden krav om at rydde op.',
        highlighted: true,
        features: [
          { label: 'Fri adgang 24/7', included: true },
          { label: 'Egen nøgle', included: true },
          { label: 'Wi-Fi (1000 Mbit)', included: true },
          { label: 'Egen fast plads', included: true },
          { label: 'Reol plads', included: true },
        ],
      },
    ],
  },
}
