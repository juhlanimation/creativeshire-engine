/**
 * Modal overlay stories.
 * Opens a modal on mount with sample content.
 */

import React, { useContext, useEffect, useMemo } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Modal from './index'
import { openModal, closeModal, useModalStore } from './store'
import { createNoopStore } from '../../../../../.storybook/mocks/context'
import { OverlayContext } from '../../../../../.storybook/helpers/OverlayContext'
import { StoryGlobalsDecorator, StoryGlobalsContext } from '../../../../../.storybook/helpers/story-globals'
import type { RevealType } from '../../../../experience/timeline/gsap'

/**
 * Sample content rendered inside the modal.
 */
function SampleContent() {
  return (
    <div style={{ padding: '4rem', maxWidth: 640, margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Modal Content</h2>
      <p style={{ lineHeight: 1.6, opacity: 0.8 }}>
        This is sample modal content demonstrating the wipe reveal animation.
        The close button in the top-right corner triggers the reverse animation.
      </p>
    </div>
  )
}

/**
 * Wrapper that opens a modal on mount.
 */
function ModalStory(args: {
  animationType?: RevealType
  backdropColor?: string
  animationDuration?: number
}) {
  const globals = useContext(StoryGlobalsContext)
  const store = useMemo(() => createNoopStore(), [])

  // Reset modal state when story re-renders (prevents stale state across stories)
  useEffect(() => {
    useModalStore.setState({ activeModal: null, transitionPhase: 'closed' })
  }, [])

  // Open modal after a short delay so the portal target has time to register
  useEffect(() => {
    const timer = setTimeout(() => {
      openModal('storybook', {
        content: <SampleContent />,
        animationType: args.animationType ?? 'wipe-left',
        backdropColor: args.backdropColor ?? 'rgba(0, 0, 0, 0.5)',
        animationDuration: args.animationDuration ?? 0.8,
      })
    }, 100)
    return () => {
      clearTimeout(timer)
      closeModal()
    }
  }, [args.animationType, args.backdropColor, args.animationDuration])

  return (
    <OverlayContext store={store} globals={globals}>
      <div style={{ minHeight: '100vh', padding: 24 }}>
        <p style={{ opacity: 0.5 }}>
          Modal opens automatically. Close it and use controls to reopen with different settings.
        </p>
        <button
          style={{
            marginTop: 16,
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'inherit',
            cursor: 'pointer',
          }}
          onClick={() =>
            openModal('storybook', {
              content: <SampleContent />,
              animationType: args.animationType ?? 'wipe-left',
              backdropColor: args.backdropColor ?? 'rgba(0, 0, 0, 0.5)',
              animationDuration: args.animationDuration ?? 0.8,
            })
          }
        >
          Open Modal
        </button>
        <Modal />
      </div>
    </OverlayContext>
  )
}

export default {
  title: 'Overlays/Modal',
  component: ModalStory,
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'GSAP-powered fullscreen modal with wipe and expand transitions' } },
  },
  argTypes: {
    animationType: {
      control: 'select',
      options: ['wipe-left', 'wipe-right', 'expand', 'fade'],
      description: 'Animation type for reveal transition',
    },
    backdropColor: {
      control: 'color',
      description: 'Backdrop overlay color',
    },
    animationDuration: {
      control: { type: 'number', min: 0.1, max: 3, step: 0.1 },
      description: 'Animation duration in seconds',
    },
  },
  decorators: [StoryGlobalsDecorator],
} satisfies Meta

export const Default: StoryObj = {
  args: {
    animationType: 'wipe-left',
    backdropColor: 'rgba(0, 0, 0, 0.5)',
    animationDuration: 0.8,
  },
}
