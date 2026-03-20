import React from 'react'

type Props = {
  status: 'ok' | 'bad' | 'down' | 'unknown'
  onRefresh?: () => void
}

export default function HealthIndicator({ status, onRefresh }: Props) {
  const color = status === 'ok' ? '#1a7f37' : status === 'down' ? '#b00020' : '#8a6d00'
  const label = status === 'ok' ? 'OK' : status === 'down' ? 'DOWN' : status === 'bad' ? 'DEGRADED' : 'UNKNOWN'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 10, height: 10, borderRadius: 6, background: color, display: 'inline-block' }} />
        <strong>Status: </strong>
        <span>{label.toLowerCase()}</span>
      </div>
      {onRefresh && <button onClick={onRefresh} style={{ padding: '6px 8px' }}>Refresh</button>}
    </div>
  )
}
