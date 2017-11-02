import React from 'react'
import { StoryDecorator } from '@storybook/react'
import { Provider } from 'react-redux'
import { Store } from 'redux'
import { State } from 'types'

export const makeTopDecorator = ({ style, ...props }: React.HTMLAttributes<HTMLDivElement>): StoryDecorator =>
  story => (
    <header>
      <div
        style={{
          display: 'flex',
          ...style,
        }}
        {...props}
      >
        {story()}
      </div>
    </header>
  )

export const makeProviderDecorator = (store: Store<Partial<State>>): StoryDecorator => story => (
  <Provider store={store as any}>
    {story()}
  </Provider>
)

export const makeCenterDecorator = ({ style, ...props }: React.HTMLAttributes<HTMLDivElement> = {}): StoryDecorator =>
  story => (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{
        padding: 20,
        backgroundColor: 'white',
        width: 550,
        height: 500,
        position: 'relative',
        ...style,
      }}
        {...props}
      >
        {story()}
      </div>
    </div>
  )

export const CenterDecorator = makeCenterDecorator()

export const CenterSectionDecorator: StoryDecorator = story => (
  <div
    style={{
      display: 'flex',
      height: '100vh',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <section className="home">
      {story()}
    </section>
  </div>
)
