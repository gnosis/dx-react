import '@storybook/react'

declare module '@storybook/react' {
  export interface Story {
    addWithJSX: Story['add']
  }
}