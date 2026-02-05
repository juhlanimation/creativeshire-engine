'use client'

/**
 * TabbedContent interactive widget.
 * Tab interface with switchable content panels.
 *
 * Features:
 * - Tab bar with clickable tab buttons
 * - Content panel that switches based on active tab
 * - Keyboard navigation (arrow keys, Home, End)
 * - ARIA attributes for accessibility
 * - Controlled and uncontrolled modes
 */

import React, { memo, forwardRef, useState, useCallback, useId } from 'react'
import type { TabbedContentProps } from './types'
import WidgetRenderer from '../../../../renderer/WidgetRenderer'
import './styles.css'

const TabbedContent = memo(forwardRef<HTMLDivElement, TabbedContentProps>(function TabbedContent(
  {
    tabs,
    defaultTab,
    activeTab: controlledActiveTab,
    onChange,
    position = 'top',
    align = 'start',
    className,
    'data-behaviour': dataBehaviour,
  },
  ref
) {
  const baseId = useId()
  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultTab ?? tabs[0]?.id ?? ''
  )

  // Support both controlled and uncontrolled modes
  const activeTab = controlledActiveTab ?? internalActiveTab
  const activeIndex = tabs.findIndex(t => t.id === activeTab)
  const activeContent = tabs.find(t => t.id === activeTab)?.content ?? []

  const handleTabClick = useCallback((tabId: string) => {
    if (!controlledActiveTab) {
      setInternalActiveTab(tabId)
    }
    onChange?.(tabId)
  }, [controlledActiveTab, onChange])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const currentIndex = activeIndex
    let newIndex = currentIndex

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault()
        newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1
        break
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault()
        newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0
        break
      case 'Home':
        e.preventDefault()
        newIndex = 0
        break
      case 'End':
        e.preventDefault()
        newIndex = tabs.length - 1
        break
      default:
        return
    }

    if (newIndex !== currentIndex && tabs[newIndex]) {
      handleTabClick(tabs[newIndex].id)
    }
  }, [activeIndex, tabs, handleTabClick])

  const classNames = [
    'tabbed-content',
    `tabbed-content--${position}`,
    className
  ].filter(Boolean).join(' ')

  const tabBar = (
    <div
      className={`tabbed-content__tabs tabbed-content__tabs--${align}`}
      role="tablist"
      aria-label="Content tabs"
      onKeyDown={handleKeyDown}
    >
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTab
        const tabId = `${baseId}-tab-${index}`
        const panelId = `${baseId}-panel-${index}`

        return (
          <button
            key={tab.id}
            id={tabId}
            className={`tabbed-content__tab ${isActive ? 'tabbed-content__tab--active' : ''}`}
            role="tab"
            aria-selected={isActive}
            aria-controls={panelId}
            tabIndex={isActive ? 0 : -1}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )

  const contentPanel = (
    <div
      id={`${baseId}-panel-${activeIndex}`}
      className="tabbed-content__panel"
      role="tabpanel"
      aria-labelledby={`${baseId}-tab-${activeIndex}`}
    >
      {activeContent.map((widget, index) => (
        <WidgetRenderer key={widget.id ?? index} widget={widget} />
      ))}
    </div>
  )

  return (
    <div
      ref={ref}
      className={classNames}
      data-behaviour={dataBehaviour}
    >
      {position === 'top' ? (
        <>
          {tabBar}
          {contentPanel}
        </>
      ) : (
        <>
          {contentPanel}
          {tabBar}
        </>
      )}
    </div>
  )
}))

export default TabbedContent
export type { TabbedContentProps, TabItem } from './types'
