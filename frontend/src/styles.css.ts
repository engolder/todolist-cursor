import { globalStyle } from '@vanilla-extract/css'

globalStyle('body', {
  margin: 0,
  fontFamily: 'system-ui, -apple-system, sans-serif',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  backgroundColor: '#f9fafb',
  color: '#1f2937',
})

globalStyle('*', {
  boxSizing: 'border-box',
})

globalStyle('button', {
  cursor: 'pointer',
  border: 'none',
  background: 'none',
  padding: 0,
  margin: 0,
  font: 'inherit',
  color: 'inherit',
}) 