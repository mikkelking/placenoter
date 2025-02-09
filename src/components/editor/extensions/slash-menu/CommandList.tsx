import React, { useEffect, useState } from 'react'
import { stopPrevent } from '../../../../utils'

import './styles/CommandList.scss'

interface CommandListProps {
  items: any[],
  command: Function,
  event: any
}

export const CommandList: React.FC<CommandListProps> = ({ items, command, event }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => setSelectedIndex(0), [items])

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowUp') {
      stopPrevent(event)
      upHandler()
      return true
    }

    if (event.key === 'ArrowDown') {
      stopPrevent(event)
      downHandler()
      return true
    }

    if (event.key === 'Enter') {
      stopPrevent(event)
      enterHandler()
      return true
    }

    return false
  }

  useEffect(() => { onKeyDown(event) }, [event])

  const upHandler = () => {
    setSelectedIndex(((selectedIndex + items.length) - 1) % items.length)
  }

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % items.length)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  const selectItem = (index: number) => {
    const item = items[index]

    if (item) setTimeout(() => command(item))
  }

  return (
    <div className="items hide-scrollbar">
      {
        items.length
          ? (
            <>
              {
                items.map((item, index) => {
                  return (
                    <article
                      className={`item flex ${index === selectedIndex ? 'is-selected' : ''}`}
                      key={index}
                      onClick={() => selectItem(index)}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <span className='flex align-center gap-8px'>
                        {item.icon()} <span dangerouslySetInnerHTML={{ __html: item.highlightedTitle || item.title }} />
                      </span>
                      {item.shortcut && <code>{item.shortcut}</code>}
                    </article>
                  )
                })
              }
            </>
          ) : <div className="item"> No result </div>
      }
    </div >
  )
}
