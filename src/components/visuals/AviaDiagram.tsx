import { VisualFrame } from './VisualFrame'

interface NodeProps {
  x: number
  y: number
  w: number
  title: string
  sub: string
  accent?: boolean
}

const H = 46

function Node({ x, y, w, title, sub, accent }: NodeProps) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={H}
        rx={10}
        fill="#10131a"
        stroke={accent ? 'rgb(255 106 61 / 0.7)' : 'rgb(255 255 255 / 0.16)'}
      />
      <text x={x + w / 2} y={y + 20} textAnchor="middle" fill="#efeee9" fontSize="13" fontWeight="600">
        {title}
      </text>
      <text
        x={x + w / 2}
        y={y + 35}
        textAnchor="middle"
        fill="#a6a8b3"
        fontSize="10"
        fontFamily="'Geist Mono Variable', monospace"
      >
        {sub}
      </text>
    </g>
  )
}

/** Animated dashed connector; the dash offset animation is disabled under reduced motion. */
function Edge({ d }: { d: string }) {
  return (
    <path
      d={d}
      fill="none"
      stroke="rgb(255 155 123 / 0.75)"
      strokeWidth="1.4"
      strokeDasharray="4 8"
      strokeLinecap="round"
      className="animate-flow"
      markerEnd="url(#avia-arrow)"
    />
  )
}

/** Request flow of A.V.I.A., redrawn from the repository's README and doc/architecture.md. */
export function AviaDiagram() {
  return (
    <VisualFrame caption="architecture · redrawn from the repo’s README">
      <svg
        viewBox="0 0 400 322"
        className="h-auto w-full max-w-[30rem]"
        role="img"
        aria-label="A.V.I.A. request flow: the Cockpit and Pulse clients call a Fastify backend-for-frontend, which caches in Redis and calls the core API. The core API reads and writes PostgreSQL with row-level security and calls a PyTorch inference agent."
      >
        <defs>
          <marker id="avia-arrow" viewBox="0 0 8 8" refX="6.5" refY="4" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0.5 0.8 6.8 4 0.5 7.2" fill="none" stroke="rgb(255 155 123 / 0.9)" strokeWidth="1.3" />
          </marker>
        </defs>

        {/* clients → BFF */}
        <Edge d="M92 58 C92 82, 172 76, 180 96" />
        <Edge d="M308 58 C308 82, 228 76, 220 96" />
        {/* BFF → Redis */}
        <Edge d="M278 121 L312 121" />
        {/* BFF → core */}
        <Edge d="M200 146 L200 180" />
        {/* core → postgres / agent */}
        <Edge d="M172 230 C166 250, 100 244, 94 266" />
        <Edge d="M228 230 C234 250, 300 244, 306 266" />

        <Node x={20} y={10} w={144} title="Cockpit" sub="React · R3F twin" />
        <Node x={236} y={10} w={144} title="Pulse" sub="React · edge client" />
        <Node x={122} y={98} w={156} title="BFF" sub="Fastify · per-client API" accent />
        <Node x={316} y={98} w={72} title="Redis" sub="cache" />
        <Node x={122} y={184} w={156} title="Core API" sub="Fastify · ingest + alerts" accent />
        <Node x={14} y={270} w={164} title="PostgreSQL" sub="row-level security" />
        <Node x={222} y={270} w={164} title="Inference agent" sub="FastAPI · PyTorch" />
      </svg>
    </VisualFrame>
  )
}
