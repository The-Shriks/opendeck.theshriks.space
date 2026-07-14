import { Resource, ShortVideo, Collection, Topic, Roadmap } from '../types';

export const RESOURCES: Resource[] = [
  {
    id: 'cpu-cache-l1-l2-l3',
    title: 'Hardware Architecture: Demystifying L1, L2, L3 CPU Caches',
    description: 'An in-depth analysis of processor cache hierarchy, cache lines, temporal/spatial locality, and the cost of cache misses in high-performance computing.',
    type: 'article',
    difficulty: 'Advanced',
    readingTime: '12 min',
    tags: ['Hardware', 'Low-Level', 'Performance', 'Systems'],
    lastUpdated: '2026-06-20',
    version: '1.4.2',
    author: 'Systems Arch Team',
    relatedIds: ['tcp-handshake-deep-dive', 'postgres-indexing-mechanics', 'how-cpu-cache-works-short'],
    gitHubUrl: 'https://github.com/dev-archive/cpu-cache-benchmarks',
    content: `### CPU Cache Hierarchy & Locality

To write high-performance software, engineers must respect the physical constraints of hardware. CPU registers can be accessed in less than **1 nanosecond (ns)**, whereas reading from main memory (DRAM) takes approximately **50–100 ns**. To bridge this massive speed gap, modern microprocessors implement a multi-tiered cache hierarchy.

\`\`\`
+---------------------------------------------------------+
|                      CPU Core                           |
|  [Registers] (<1ns)                                    |
|       |                                                 |
|  [L1 Data Cache] (~1-2ns, 32KB-64KB per core)          |
|  [L1 Instruction Cache] (~1-2ns, 32KB-64KB per core)   |
+---------------------------------------------------------+
                            |
+---------------------------------------------------------+
|  [L2 Unified Cache] (~3-5ns, 256KB-1MB per core)        |
+---------------------------------------------------------+
                            |
+---------------------------------------------------------+
|  [L3 Shared Cache] (~10-15ns, 8MB-64MB shared)          |
+---------------------------------------------------------+
                            |
+---------------------------------------------------------+
|  [Main Memory (DRAM)] (~50-100ns, 16GB-128GB shared)    |
+---------------------------------------------------------+
\`\`\`

#### 1. Temporal and Spatial Locality
*   **Temporal Locality**: If a memory location is referenced, it is highly likely to be referenced again in the near future (e.g., inside a tight loop).
*   **Spatial Locality**: If a memory location is referenced, nearby memory locations are likely to be referenced soon (e.g., traversing a contiguous array).

#### 2. Cache Lines
Data is loaded into cache in fixed-size blocks called **Cache Lines** (typically **64 bytes**). 
If you access a single \`int64\` (8 bytes), the processor fetches the entire 64-byte line containing that integer.

#### Code Comparison: Row-Major vs. Column-Major Iteration
Traversing a 2D array row-by-row utilizes spatial locality because memory is contiguous. Traversing column-by-column causes constant cache misses (cache thrashing).

\`\`\`c
// Fast: Row-Major (Exploits Spatial Locality)
for (int r = 0; r < ROWS; r++) {
    for (int c = 0; c < COLS; c++) {
        sum += matrix[r][c]; // Sequential contiguous access (stride-1)
    }
}

// Slow: Column-Major (High Cache Miss Rate)
for (int c = 0; c < COLS; c++) {
    for (int r = 0; r < ROWS; r++) {
        sum += matrix[r][c]; // Strided access (matrix index jumping)
    }
}
\`\`\`

#### Benchmarking the Overhead
Typical CPU latency overhead breakdown:
- L1 Hit: ~4 cycles
- L2 Hit: ~12 cycles
- L3 Hit: ~40 cycles
- DRAM Access: ~200+ cycles

Writing cache-friendly code often yields 10x to 100x performance improvements without changing the underlying computational complexity.`
  },
  {
    id: 'tcp-handshake-deep-dive',
    title: 'Visualizing TCP/IP Handshake & Socket Lifecycle State Machine',
    description: 'A reference sheet detailing the three-way handshake, four-way teardown, active versus passive closes, and socket state durations like TIME_WAIT.',
    type: 'cheat-sheet',
    difficulty: 'Intermediate',
    readingTime: '8 min',
    tags: ['Networking', 'TCP-IP', 'Linux', 'Web-Protocols'],
    lastUpdated: '2026-07-02',
    version: '2.1.0',
    author: 'NetOps Core',
    relatedIds: ['cpu-cache-l1-l2-l3', 'raft-consensus-protocol', 'visualizing-tcp-handshake-short'],
    gitHubUrl: 'https://github.com/dev-archive/network-tracing-tools',
    content: `### TCP Connection Lifecycle

This cheat sheet documents the complete transition table of TCP sockets, tracing both the establishment (3-Way Handshake) and termination (4-Way Teardown) states.

\`\`\`
   Client (Active Open)                             Server (Passive Open)
           |                                                 |
           |  -- SYN (Seq=x) ------------------------->      | [LISTEN]
    [SYN-SENT]                                               |
           |                                                 |
           |  <-- SYN-ACK (Seq=y, Ack=x+1) ------------      | [SYN-RCVD]
           |                                                 |
    [ESTAB] |  -- ACK (Ack=y+1) ----------------------->      | [ESTAB]
           |                                                 |
           v                                                 v
           ========= DATA TRANSFER ACTIVE IN ESTABLISHED STATE =========
           |                                                 |
           |  -- FIN (Seq=u) -------------------------->      |
  [FIN-WAIT-1]                                               | [CLOSE-WAIT]
           |                                                 | (App notified)
           |  <-- ACK (Ack=u+1) -----------------------      |
  [FIN-WAIT-2]                                               |
           |                                                 |  -- FIN (Seq=v) -->
           |  <-- FIN (Seq=v) -------------------------      | [LAST-ACK]
           |                                                 |
  [TIME-WAIT] -- ACK (Ack=v+1) ----------------------->      | [CLOSED]
  (2 * MSL) |                                                |
           v                                                 v
   [CLOSED]
\`\`\`

#### Critical Socket States Reference

| State | Initiator | Description |
| :--- | :--- | :--- |
| **LISTEN** | Server | Waiting for connection requests from remote TCP ports. |
| **SYN-SENT** | Client | Sent a connection request (SYN), waiting for matching SYN-ACK. |
| **SYN-RECEIVED** | Server | Received SYN and sent SYN-ACK. Waiting for final ACK from client. |
| **ESTABLISHED** | Both | Connection is active. Data transfer can flow bi-directionally. |
| **FIN-WAIT-1** | Active Close | Initiated close, sent FIN. Waiting for ACK or FIN from peer. |
| **FIN-WAIT-2** | Active Close | Received ACK for FIN. Waiting for peer to send its FIN. |
| **CLOSE-WAIT** | Passive Close | Received FIN from peer, sent ACK. Waiting for local application to close. |
| **LAST-ACK** | Passive Close | Sent local FIN. Waiting for final ACK from the peer. |
| **TIME-WAIT** | Active Close | Waiting for 2 * Maximum Segment Lifetime (MSL) to ensure remote host received ACK. Prevent overlapping sequences. |

#### Useful Sysctl Optimizations for Linux Servers

Under high load, servers can run out of ephemeral ports or get bottlenecked in \`TIME_WAIT\`. Adjust the following in \`/etc/sysctl.conf\`:

\`\`\`bash
# Enable fast recycling/reuse of TIME_WAIT sockets for new connections
net.ipv4.tcp_tw_reuse = 1

# Max local sockets allowed in TIME_WAIT state
net.ipv4.tcp_max_tw_buckets = 1440000

# Keepalive probes interval
net.ipv4.tcp_keepalive_intvl = 15
net.ipv4.tcp_keepalive_probes = 5
\`\`\`
`
  },
  {
    id: 'raft-consensus-protocol',
    title: 'Raft Consensus Protocol: Leader Election and Log Replication',
    description: 'A formal specification of the Raft consensus engine. Covers state machines, term numbers, election timeouts, heartbeats, and joint consensus updates.',
    type: 'article',
    difficulty: 'Advanced',
    readingTime: '15 min',
    tags: ['Distributed-Systems', 'Consensus', 'System-Design', 'Go'],
    lastUpdated: '2026-05-11',
    version: '1.0.0',
    author: 'Dist-Sys Group',
    relatedIds: ['tcp-handshake-deep-dive', 'ebpf-devops-intro', 'understanding-raft-consensus-short'],
    gitHubUrl: 'https://github.com/dev-archive/toy-raft-go',
    content: `### Raft Consensus Protocol

Raft is a consensus algorithm designed to be easy to understand. It is equivalent to Paxos in fault-tolerance and performance but decomposes the consensus problem into independent subproblems: **Leader Election**, **Log Replication**, and **Safety**.

\`\`\`
                +----------------------------+
                |          Follower          |
                +----------------------------+
                   ^      |            ^  |
      Times out,   |      | Steps      |  | Responds to
      starts new   |      | down       |  | AppendEntries
      election     |      v            |  | or RequestVote
                +-------------------+  |  |
                |     Candidate     |--+  |
                +-------------------+     |
                   |                      |
                   | Wins                 | Discover leader
                   | election             | with higher term
                   v                      |
                +-------------------+     |
                |      Leader       |-----+
                +-------------------+
\`\`\`

#### 1. Node Roles & State transitions
At any given time, each server is in one of three states:
*   **Leader**: Handles all client requests, manages log replication. Only one leader can exist at a term.
*   **Follower**: Passive recipient of RPCs from Leaders and Candidates.
*   **Candidate**: Temporary state used to elect a new leader.

#### 2. Log Replication Protocol
1.  Client sends command to Leader.
2.  Leader appends command to its own log as an uncommitted entry.
3.  Leader sends \`AppendEntries\` RPCs to all Followers.
4.  Followers append entries, verify term/index invariants, and respond with success.
5.  Once entry is replicated on a **majority** of servers, the Leader commits it and applies it to its state machine.
6.  Leader notifies Followers of the commit in subsequent \`AppendEntries\` RPCs.

#### Complete Leader Election Go Spec
Below is a simplified structural layout in Go representing candidate election timeouts:

\`\`\`go
type NodeState int
const (
    Follower NodeState = iota
    Candidate
    Leader
)

type RaftNode struct {
    mu          sync.Mutex
    peers       []*RaftNode
    id          int
    currentTerm int
    votedFor    int
    log         []LogEntry
    
    state       NodeState
    heartbeat   chan bool
}

func (rf *RaftNode) RunElectionLoop() {
    for {
        rf.mu.Lock()
        state := rf.state
        rf.mu.Unlock()

        if state == Leader {
            rf.sendHeartbeats()
            time.Sleep(50 * time.Millisecond)
            continue
        }

        // Random election timeout between 150ms and 300ms
        timeout := time.Duration(150+rand.Intn(150)) * time.Millisecond
        select {
        case <-rf.heartbeat:
            // Heartbeat received, reset timeout
        case <-time.After(timeout):
            // Timed out, start election
            rf.startElection()
        }
    }
}
\`\`\`

#### Safety Guarantees
Raft enforces these critical invariants:
*   **Election Safety**: At most one leader can be elected per term.
*   **Leader Append-Only**: A leader never overwrites or deletes its entries; it only appends new entries.
*   **Log Matching**: If two logs contain an entry with the same index and term, then they are identical in all entries up through the given index.
*   **Leader Completeness**: If a log entry is committed in a given term, that entry will be present in the logs of the leaders for all higher terms.`
  },
  {
    id: 'postgres-indexing-mechanics',
    title: 'PostgreSQL Indexing Mechanics: B-Tree, GIN, and GiST Under the Hood',
    description: 'An architectural reference sheet analyzing index page layouts, heap tables, write-ahead logs (WAL), and specialized index types in Postgres.',
    type: 'cheat-sheet',
    difficulty: 'Intermediate',
    readingTime: '9 min',
    tags: ['Databases', 'PostgreSQL', 'Performance', 'SQL'],
    lastUpdated: '2026-07-01',
    version: '1.2.0',
    author: 'DB Core Group',
    relatedIds: ['cpu-cache-l1-l2-l3', 'postgres-indexing-tricks-short'],
    gitHubUrl: 'https://github.com/dev-archive/postgres-tuning-scripts',
    content: `### PostgreSQL Index Structures

PostgreSQL isolates data storage in **Heap files** divided into **8KB pages**. When you query without an index, the engine executes a sequential heap scan, loading every page into the shared buffer pool. Indexes speed this up by storing ordered key pointers to heap row identifiers (TIDs).

\`\`\`
            [B-Tree Root Index Node]
                  /         \\
     [Internal Node]         [Internal Node]
        /        \\               /         \\
  [Leaf Node] [Leaf Node]  [Leaf Node] [Leaf Node]
      |            |            |            |
      v            v            v            v
  +-------------------------------------------------+
  |                8KB Heap Page                    |
  | [TID: (Block 0, Item 1)] -> Row Data "Alice"    |
  | [TID: (Block 0, Item 2)] -> Row Data "Bob"      |
  +-------------------------------------------------+
\`\`\`

#### Special Index Types & Selection Matrix

| Index Type | Underlying Algorithm | Optimal Query Use-Case |
| :--- | :--- | :--- |
| **B-Tree** | High-fanout self-balancing search tree | Equality (\`=\`), Range queries (\`<\`, \`>=\`), Sort operators |
| **GIN** | Generalized Inverted Index (holds entry mappings) | Array contains (\`@>\`), Full-text search columns, JSONB keys |
| **GiST** | Generalized Search Tree (highly extensible) | Geometric coordinates, Range overlaps (\`&&\`), Nearest neighbor |
| **BRIN** | Block Range Index (min/max ranges per page range) | Massive append-only chronological tables (e.g., timeseries logs) |
| **Hash** | Flat hash lookup table | Simple equality (\`=\`) only; larger size than B-Tree |

#### Query Planning Diagnostics

Use \`EXPLAIN (ANALYZE, BUFFERS)\` to measure index efficiency:

\`\`\`sql
-- Querying JSONB column using a GIN index
CREATE INDEX idx_users_metadata ON users USING gin (metadata);

EXPLAIN (ANALYZE, BUFFERS)
SELECT id, username FROM users 
WHERE metadata @> '{"role": "administrator"}';
\`\`\`

Output interpretation:
*   **Bitmap Index Scan**: Scans the GIN index structure to construct a memory bitmask of matched TIDs.
*   **Bitmap Heap Scan**: Pulls only the physical 8KB pages from the heap containing matched TIDs.
*   **Buffers: shared hit=4**: Out of 4 heap pages accessed, all 4 were already cached in PostgreSQL \`shared_buffers\`, resulting in 0 physical disk read operations.`
  },
  {
    id: 'ebpf-devops-intro',
    title: 'Introduction to eBPF: Sandboxed Kernel Execution for DevOps and Security',
    description: 'Learn how extended Berkeley Packet Filters allow dynamically instrumenting the Linux kernel without rebuilding modules or modifying system source.',
    type: 'article',
    difficulty: 'Advanced',
    readingTime: '14 min',
    tags: ['Linux', 'eBPF', 'DevOps', 'Security'],
    lastUpdated: '2026-06-15',
    version: '1.0.1',
    author: 'Kernel Tools Lab',
    relatedIds: ['raft-consensus-protocol', 'docker-multistage-builds'],
    gitHubUrl: 'https://github.com/dev-archive/ebpf-trace-exec',
    content: `### Understanding eBPF

Extended BPF (eBPF) represents a monumental shift in how engineers trace, observe, and secure Linux operating systems. Historically, adding features to the Linux kernel required writing kernel modules—a risky operation where a single Null Pointer Dereference could instantly trigger a **Kernel Panic** and bring down the host server.

eBPF solves this by providing a high-performance **Sandboxed Virtual Machine** inside the Linux kernel. It allows user-space programs to execute safe bytecode at specific tracepoints, kprobes, and sockets.

\`\`\`
  USER SPACE                               KERNEL SPACE
+------------------+                    +------------------------------------+
|  Tracing Client  |                    |             eBPF VM                |
| (Go/Rust loader) |                    |  [Verifier]                        |
|        |         |                    |     | (Guarantees loop termination |
|        | Loads   |                    |     |  and safe memory accesses)   |
|        v Bytecode|                    |     v                              |
|   [eBPF Program] | -- sys_bpf() ----> |  [JIT Compiler] -> Native CPU      |
|                  |                    +------------------------------------+
|                  |                                 |
|  [eBPF Maps] <===|====== Shared Memory Pipeline ===+ (Read/Write Events)   |
+------------------+                    +------------------------------------+
                                        |  [KProbes]  [Sockets]  [Tracepoints]|
                                        +------------------------------------+
\`\`\`

#### 1. The Verification Phase
Before an eBPF program is loaded, the kernel's strictly analytical **Verifier** parses the instructions to guarantee:
*   The program cannot dereference an uninitialized pointer.
*   The program cannot overflow or underflow stack limits.
*   All loops must have verifiable exit boundaries (preventing infinite kernel hangs).
*   The program is limited to authorized helper functions.

#### 2. Practical Kernel Hooking with Rust
Using the modern \`aya\` library, we can write eBPF loaders and kernel handlers in safe Rust:

\`\`\`rust
// eBPF kernel program (loaded on syscall sys_enter_execve)
#![no_std]
#![no_main]

use aya_bpf::{macros::kprobe, programs::ProbeContext};
use aya_log_ebpf::info;

#[kprobe(name="trace_execve")]
pub fn trace_execve(ctx: ProbeContext) -> u32 {
    match try_trace_execve(ctx) {
        Ok(ret) => ret,
        Err(err) => err as u32,
    }
}

inline fn try_trace_execve(ctx: ProbeContext) -> Result<u32, i32> {
    // Read executing command arguments and log to user space ring buffer
    info!(&ctx, "sys_execve triggered on host CPU");
    Ok(0)
}
\`\`\`

#### Key Capabilities
*   **Networking**: bypassing standard network stack queues via XDP (eXpress Data Path) to drop DDOS packets directly at the network driver layer.
*   **Observability**: tracking disk IO, memory leaks, scheduler delays, or thread contention without modifying any application code.
*   **Security Enforcement**: dynamically blocking unauthorized binary execution or socket creation using LSM (Linux Security Module) hooks.`
  },
  {
    id: 'docker-multistage-builds',
    title: 'Docker Multi-stage Builds: Shrinking Images from Gigabytes to Megabytes',
    description: 'A comprehensive guide on leveraging multi-stage Dockerfiles to isolate compiler toolchains and assemble ultra-minimal production images.',
    type: 'docs',
    difficulty: 'Intermediate',
    readingTime: '6 min',
    tags: ['DevOps', 'Docker', 'Containers', 'Security'],
    lastUpdated: '2026-06-30',
    version: '3.0.0',
    author: 'DevOps Lead',
    relatedIds: ['ebpf-devops-intro', 'golang-http-client-perf'],
    gitHubUrl: 'https://github.com/dev-archive/docker-optimization',
    content: `### Docker Optimization: Multi-Stage Builds

One of the most common mistakes developers make is shipping production containers that contain the compiler, package managers, and development dependencies. This bloats image sizes, slows down deployments, and dramatically increases the **attack surface** of the container.

Multi-stage builds allow you to use multiple \`FROM\` statements in a single Dockerfile. You can compile in a heavy environment and copy only the compiled binary or compiled static files into a pristine, lightweight runner image.

\`\`\`
+------------------------------------+
|  STAGE 1: builder (1.2 GB)         |
|  FROM golang:1.21-alpine           |
|  - Downloads Go dependencies       |
|  - Compiles binary with CGO_ENABLED=0|
+------------------------------------+
                 |
                 | (Copy Compiled Binary)
                 v
+------------------------------------+
|  STAGE 2: final runner (12 MB)     |
|  FROM scratch                      |
|  - Contains no shell, no curl      |
|  - Copies TLS certificates         |
|  - Runs binary directly            |
+------------------------------------+
\`\`\`

#### Example Optimized Dockerfile for a Go Web Service

\`\`\`dockerfile
# --- Stage 1: Build compilation context ---
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Leverage Docker cache layer for dependencies
COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Compile optimized static binary with stripped debug info
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o web-service main.go

# --- Stage 2: Clean production container ---
FROM scratch

# Secure container by running as non-root user
COPY --from=builder /etc/passwd /etc/passwd
USER 65534

# Copy static compiled binary from builder stage
COPY --from=builder /app/web-service /web-service

# Copy CA TLS Certificates for external HTTPS calls
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt

EXPOSE 8080

ENTRYPOINT ["/web-service"]
\`\`\`

#### Image Size Analysis
*   **Standard Build Image** (\`golang:1.21-alpine\` containing dependencies, source code, caches): **~850 MB**
*   **Multi-Stage Scratch Image** (only compiled binary and certificates): **~14.2 MB**
*   **Result**: **98.3% size reduction**, faster startup times, and zero binary vulnerabilities.`
  },
  {
    id: 'golang-http-client-perf',
    title: 'High-Performance Go HTTP Client: Pool Tuning and Keepalive Mechanics',
    description: 'A production snippet configuring net/http Transport pools to avoid socket exhaustion, configure custom dialers, and handle server timeouts properly.',
    type: 'tool',
    difficulty: 'Intermediate',
    readingTime: '5 min',
    tags: ['Go', 'APIs', 'Networking', 'Concurrency'],
    lastUpdated: '2026-07-05',
    version: '1.1.0',
    author: 'Core Performance Team',
    relatedIds: ['tcp-handshake-deep-dive', 'docker-multistage-builds'],
    gitHubUrl: 'https://github.com/dev-archive/go-http-pool',
    content: `### High-Performance Go HTTP Client

The default \`net/http\` Client in Go is optimized for ease of use, not highly concurrent production workloads. By default, it does not set request timeouts and uses a connection pool that can easily leak socket connections, causing \`too many open files\` errors under load.

Below is a production-hardened configuration for highly concurrent workloads:

\`\`\`go
package client

import (
    "net"
    "net/http"
    "time"
)

func NewHardenedClient() *http.Client {
    // Custom dialer to enforce low-level connection timeouts
    dialer := &net.Dialer{
        Timeout:   3 * time.Second,  // Limits time spent establishing connection
        KeepAlive: 30 * time.Second, // Interval between TCP keepalive probes
    }

    // Configure Transport parameters
    transport := &http.Transport{
        Proxy:                 http.ProxyFromEnvironment,
        DialContext:           dialer.DialContext,
        ForceAttemptHTTP2:     true,
        MaxIdleConns:          100,              // Total idle connections across all hosts
        MaxIdleConnsPerHost:   100,              // Prevents socket closures on high-concurrency requests to single host
        IdleConnTimeout:       90 * time.Second, // Duration idle connection remains active in pool
        TLSHandshakeTimeout:   5 * time.Second,  // Timeout for TLS handshakes
        ExpectContinueTimeout: 1 * time.Second,
    }

    return &http.Client{
        Transport: transport,
        Timeout:   10 * time.Second, // Absolute threshold for entire HTTP request lifecycle
    }
}
\`\`\`

#### Common Pitfalls Explained
*   **MaxIdleConnsPerHost**: The default value is **2**. If you send 100 concurrent requests to a single microservice, 98 connections will be closed and re-opened instantly, leading to severe local port allocation throttling and high latencies.
*   **Client.Timeout**: If not set, requests can hang indefinitely due to firewall silent drops, locking up goroutines and causing memory leaks.`
  },
  {
    id: 'system-review-prompts',
    title: 'AI System Design Architecture Review Prompt Stack',
    description: 'A structural system architect prompt designed to force LLMs to conduct rigorous trade-off analyses, database comparisons, and safety-critical hazard reviews.',
    type: 'prompt',
    difficulty: 'Advanced',
    readingTime: '4 min',
    tags: ['AI-Prompts', 'System-Design', 'AI-Engineering'],
    lastUpdated: '2026-04-12',
    version: '1.0.0',
    author: 'Principal Architect',
    relatedIds: ['cpu-cache-l1-l2-l3', 'raft-consensus-protocol'],
    content: `### System Architecture Review Prompt

This prompt is engineered to run inside advanced LLMs (such as Gemini 1.5 Pro or Gemini 2.0 Flash) to evaluate technical design documents. It structures the AI as an expert, skeptical staff engineer.

#### The Prompt Template

\`\`\`markdown
You are acting as an elite, highly cynical Principal Systems Architect.
Analyze the provided system architecture proposal and generate a rigorous critical review.

Structure your analysis into the following mandatory sections:

1. LATENCY & CAPACITY BOTTLENECKS
   - Analyze the proposed write/read paths. Identify components where request surges will cause queue starvation.
   - Project memory consumption based on the defined data sizes and cache eviction policies.

2. DATABASE CONSISTENCY & FLUSH RISK
   - Critically evaluate the chosen storage engine (e.g., Relational vs. Document vs. KV).
   - Trace race conditions during network partition events (CAP theorem).
   - What happens if a nodes crashes immediately after a WAL append but before memory write?

3. DISASTER RECOVERY & FAILOVER
   - Analyze split-brain failure scenarios for the designated coordinator.
   - Evaluate RTO (Recovery Time Objective) and RPO (Recovery Point Objective) limitations.

4. SAFETY & BOUNDARIES
   - Outline 3 non-obvious edge cases where this system will quietly lose data or serve stale reads without throwing explicit errors.
   - Propose architectural counter-measures for each.

Format the output strictly in monospace blocks where applicable for architectural flows, and do not use generic fluff or introductory conversational filler. Jump straight to the analysis.
\`\`\`

#### Example Usage Response Flow
When executed, this prompt forces the AI to output rigorous trade-offs (e.g. evaluating DynamoDB split keys or Raft term lags) rather than simple generic boilerplate explanations.`
  }
];

export const SHORTS: ShortVideo[] = [
  {
    id: 'how-cpu-cache-works-short',
    title: 'Why RAM is Too Slow: CPU Caches Explained Visualized',
    description: 'A step-by-step trace of cache hit vs. cache miss latencies, demonstrating why memory layouts dictate code speed more than instruction counts.',
    notes: `This short tutorial details how CPU Cache hierarchy impacts modern applications. We compare Row-Major (contiguous memory) versus Column-Major array traversals.

#### Latency Numbers You Must Memorize:
- L1 Cache Access: ~1 ns (32 KB per core)
- L2 Cache Access: ~4 ns (512 KB per core)
- L3 Cache Access: ~12 ns (16-64 MB shared)
- Main Memory (RAM): ~100 ns (External Bus)

When data isn't in L1/L2/L3, the processor stalls. This is called a **DRAM Cache Miss**.`,
    codeSnippet: `// GO BENCHMARK TRAVERSAL
const Size = 2048
var matrix [Size][Size]int64

// Fast Traversal: Temporal & Spatial Locality (stride-1)
func BenchmarkRowMajor(b *testing.B) {
    for i := 0; i < b.N; i++ {
        for r := 0; r < Size; r++ {
            for c := 0; c < Size; c++ {
                _ = matrix[r][c]
            }
        }
    }
}

// Slow Traversal: Constantly skipping Cache Lines (stride-N)
func BenchmarkColumnMajor(b *testing.B) {
    for i := 0; i < b.N; i++ {
        for c := 0; c < Size; c++ {
            for r := 0; r < Size; r++ {
                _ = matrix[r][c]
            }
        }
    }
}`,
    codeLanguage: 'go',
    diagram: `[CPU Core] --> (Request Addr 0x100)
    |
    v (L1 Cache Miss!)
[L2 Cache] --> (Request Addr 0x100 - Miss!)
    |
    v (L3 Cache Miss!)
[L3 Cache] --> (Request Addr 0x100 - Miss!)
    |
    +==== FETCH ENGINE ====> Loads 64-byte boundary starting at 0x100
                            from slow DRAM (takes 100ns / 200 CPU cycles)`,
    downloads: [
      { label: 'Go Locality Benchmarks', url: 'https://github.com/dev-archive/cpu-cache-benchmarks' }
    ],
    relatedTopicIds: ['system-design', 'linux', 'databases'],
    relatedResourceIds: ['cpu-cache-l1-l2-l3']
  },
  {
    id: 'visualizing-tcp-handshake-short',
    title: 'Inside the TCP 3-Way Handshake: Tracing Network Packets',
    description: 'An interactive packet-by-packet capture breakdown tracing SYN, SYN-ACK, and ACK flags using Tcpdump.',
    notes: `An illustration of how a server creates listener queues (SYN backlog) and how SYN flooding DDOS works.

#### Tracing with Tcpdump:
\`\`\`bash
# Trace raw TCP handshake on loopback interface
tcpdump -i lo0 -v -nn 'tcp[tcpflags] & (tcp-syn|tcp-ack) != 0'
\`\`\`

#### The TCP Flag Bytes Layout:
The flags are situated in the 13th byte of the TCP header:
- CWR | ECE | URG | ACK | PSH | RST | SYN | FIN`,
    codeSnippet: `# TCP Socket Server in Python
import socket

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
server.bind(('0.0.0.0', 8080))
server.listen(128) # Backlog limit for SYN queue

print("Socket server listening on port 8080...")
while True:
    client_sock, client_addr = server.accept()
    client_sock.sendall(b"HTTP/1.1 200 OK\\r\\nContent-Length: 2\\r\\n\\r\\nOK")
    client_sock.close()`,
    codeLanguage: 'python',
    diagram: `Client                        Server
  |                             |
  | --- [SYN] Seq=100 --------> | (Server places in SYN Backlog)
  |                             |
  | <--- [SYN,ACK] Seq=900 -----|
  |      Ack=101                |
  |                             |
  | --- [ACK] Seq=101 --------> | (Server moves socket to Accept Queue)
  v      Ack=901                v`,
    downloads: [
      { label: 'Tcpdump Reference Sheet', url: 'https://github.com/dev-archive/network-tracing-tools' }
    ],
    relatedTopicIds: ['networking', 'system-design'],
    relatedResourceIds: ['tcp-handshake-deep-dive']
  },
  {
    id: 'understanding-raft-consensus-short',
    title: 'How Raft Replicates Logs Across Distributed Servers',
    description: 'A visual walkthrough of log entry replication, majority consensus, and commit indexing under network splits.',
    notes: `Raft decomposes consensus into three modules. This short video visualizes how a network partition creates a split-brain condition and how Raft automatically heals without violating linearizability.

When partition occurs, the side with the **majority (quorum)** can commit logs. The minority side cannot reach quorum, so its logs remain uncommitted and are overwritten once the partition heals.`,
    codeLanguage: 'go',
    codeSnippet: `// Raft Node Log Replication Check
func (rf *RaftNode) maybeCommitEntry(index int) bool {
    if index <= rf.commitIndex {
        return false
    }
    
    count := 1 // Count self
    for i, peer := range rf.peers {
        if i != rf.id && peer.matchIndex >= index {
            count++
        }
    }
    
    // Check if majority reached (Quorum)
    if count > len(rf.peers)/2 {
        rf.commitIndex = index
        rf.applyToStateMachine()
        return true
    }
    return false
}`,
    diagram: `Partition heals. Term 2 Leader overrides Term 1 stale Candidate:

+---------------+                  +---------------+
| Leader (Term2)|                  | Follower (T2) |
| Log: [A][B][C]| <=== REPLICATE ==| Log: [A][B][C]|
+---------------+                  +---------------+
       |
       v (Overwrites stale entry [X] in minority)
+---------------+
| Follower (T1) |
| Log: [A][B][C]| (Was previously [A][B][X] during split)
+---------------+`,
    downloads: [
      { label: 'Raft Spec PDF Implementation', url: 'https://raft.github.io/raft.pdf' }
    ],
    relatedTopicIds: ['system-design', 'databases'],
    relatedResourceIds: ['raft-consensus-protocol']
  }
];

export const COLLECTIONS: Collection[] = [
  {
    id: 'complete-backend-learning',
    title: 'Complete Backend Learning & Systems Engineering',
    description: 'An advanced, structured learning track focusing on TCP socket lifecycles, Go concurrency, cache performance tuning, and robust server engineering.',
    resourceIds: ['cpu-cache-l1-l2-l3', 'tcp-handshake-deep-dive', 'golang-http-client-perf'],
    difficulty: 'Intermediate'
  },
  {
    id: 'distributed-systems',
    title: 'Distributed Systems Mastery & Consensus Design',
    description: 'Deep dive into fault-tolerance, Raft/Paxos algorithms, linearizability guarantees, and network topologies.',
    resourceIds: ['raft-consensus-protocol', 'tcp-handshake-deep-dive', 'system-review-prompts'],
    difficulty: 'Advanced'
  },
  {
    id: 'docker-devops-stack',
    title: 'Complete DevOps Stack & Linux Internals',
    description: 'Practical guides on containers shrinking, secure namespaces isolation, and system performance monitoring using eBPF hooks.',
    resourceIds: ['docker-multistage-builds', 'ebpf-devops-intro', 'tcp-handshake-deep-dive'],
    difficulty: 'Advanced'
  }
];

export const TOPICS: Topic[] = [
  {
    id: 'system-design',
    name: 'System Design',
    category: 'System Design',
    overview: 'The architectural discipline of specifying distributed software nodes, communication interfaces, cache boundaries, and database storage patterns to handle high scale with clean fault boundaries.',
    learningPath: [
      'Understand Client-Server and DNS mechanisms',
      'Analyze the TCP Socket lifecycle and HTTP boundaries',
      'Design reliable caching layers (Temporal Locality and Redis)',
      'Model relational indexing engines (Postgres B-Trees)',
      'Master Distributed Consensus protocols (Raft, Paxos)'
    ],
    resourceIds: ['cpu-cache-l1-l2-l3', 'raft-consensus-protocol', 'system-review-prompts'],
    recommendedRepos: [
      { name: 'donnemartin/system-design-primer', description: 'Learn how to design large-scale systems. Prep for the system design interview.', stars: '260k', url: 'https://github.com/donnemartin/system-design-primer' },
      { name: 'karan/projects', description: 'A list of practical projects that any developer can implement to learn low-level programming.', stars: '28k', url: 'https://github.com/karan/projects' }
    ]
  },
  {
    id: 'databases',
    name: 'Databases & Performance',
    category: 'AI & Data',
    overview: 'Deep architectural indexing, storage topologies, WAL logging buffers, and ACID isolation execution pipelines in Postgres, Redis, and Kafka.',
    learningPath: [
      'Master the relational storage Heap file and 8KB page layout',
      'Implement indexing systems (B-Tree, GIN, GiST)',
      'Analyze Transaction isolation levels (Read Committed, Serializable)',
      'Optimize disk flushes using Write-Ahead Logging (WAL)'
    ],
    resourceIds: ['postgres-indexing-mechanics', 'cpu-cache-l1-l2-l3'],
    recommendedRepos: [
      { name: 'postgres/postgres', description: 'The official mirror of the PostgreSQL relational database code repository.', stars: '14k', url: 'https://github.com/postgres/postgres' }
    ]
  },
  {
    id: 'linux',
    name: 'Linux & Kernel Internals',
    category: 'Infrastructure',
    overview: 'Observing process execution contexts, eBPF trace loops, memory-mapped files, sysctl optimizations, and hardware cache structures.',
    learningPath: [
      'Understand Syscall entry architectures (sys_execve)',
      'Master eBPF kernel bytecode verification boundaries',
      'Optimize TCP buffers inside the Linux sysctl stack',
      'Configure namespace/cgroup boundaries for isolation'
    ],
    resourceIds: ['ebpf-devops-intro', 'cpu-cache-l1-l2-l3', 'docker-multistage-builds'],
    recommendedRepos: [
      { name: 'torvalds/linux', description: 'Linux kernel source tree.', stars: '165k', url: 'https://github.com/torvalds/linux' },
      { name: 'iovisor/bcc', description: 'BPF Compiler Collection - Tools for system tracing, network optimization, and monitoring.', stars: '18k', url: 'https://github.com/iovisor/bcc' }
    ]
  },
  {
    id: 'networking',
    name: 'Network Engineering',
    category: 'Security & Core',
    overview: 'Low-level TCP sequence matching, connection sockets handling, socket reuse limits, packet analysis, and proxy routing optimization.',
    learningPath: [
      'Trace client-side TCP Handshakes (SYN, SYN-ACK, ACK)',
      'Debug Socket depletion rates under high connection scales',
      'Tweak TIME_WAIT recycling sysctl properties',
      'Implement connection pools to prevent file descriptor leaks'
    ],
    resourceIds: ['tcp-handshake-deep-dive', 'golang-http-client-perf'],
    recommendedRepos: [
      { name: 'nmap/nmap', description: 'Nmap Utility Network Discovery and Security Audits Repository.', stars: '12k', url: 'https://github.com/nmap/nmap' }
    ]
  },
  {
    id: 'go',
    name: 'Go Engineering',
    category: 'Language',
    overview: 'High-performance concurrency patterns using goroutines, net/http Transport connection pooling, and compiler flags optimizations.',
    learningPath: [
      'Understand the Go scheduler M:P:N multiplexing pipeline',
      'Tune client HTTP pooling parameters (MaxIdleConnsPerHost)',
      'Prevent goroutine leakage with explicit Context timers',
      'Optimize binary compile outputs by stripping debug info (-s -w)'
    ],
    resourceIds: ['golang-http-client-perf', 'raft-consensus-protocol'],
    recommendedRepos: [
      { name: 'golang/go', description: 'The Go programming language compiler and runtime tools.', stars: '122k', url: 'https://github.com/golang/go' }
    ]
  }
];

export const ROADMAPS: Roadmap[] = [
  {
    id: 'backend-eng-roadmap',
    title: 'Systems & Backend Engineering Roadmap',
    description: 'A comprehensive, low-level guide to mastering high-throughput backend services, OS networking constraints, and memory design patterns.',
    steps: [
      { id: 'be-1', title: '1. Machine Locality & CPU Caches', desc: 'Understand physical memory layout bottlenecks, spatial/temporal cache locality, row/column major strides, and cache line structures.', resourceId: 'cpu-cache-l1-l2-l3', connections: ['be-2'] },
      { id: 'be-2', title: '2. High-Performance Socket I/O', desc: 'Dive into TCP socket transitions, backlog queues, ephemeral port exhaustion, and keepalive probes optimization.', resourceId: 'tcp-handshake-deep-dive', connections: ['be-3'] },
      { id: 'be-3', title: '3. Durable Indexing Engines', desc: 'Master Postgres index strategies, B-Trees structures, WAL buffers layout, and disk seek optimization.', resourceId: 'postgres-indexing-mechanics', connections: ['be-4'] },
      { id: 'be-4', title: '4. Scalable Client Pooling', desc: 'Configure robust connection pools in Go/Rust, manage idle timeout limits, and avoid file descriptor leaks.', resourceId: 'golang-http-client-perf', connections: [] }
    ]
  },
  {
    id: 'dist-sys-roadmap',
    title: 'Distributed Architecture Mastery Path',
    description: 'A step-by-step consensus roadmap tracking data consistency, state synchronization, and fault boundaries.',
    steps: [
      { id: 'ds-1', title: '1. Reliable Socket Foundation', desc: 'Establish a rock-solid, non-blocking networking pipeline across heterogeneous cluster nodes.', resourceId: 'tcp-handshake-deep-dive', connections: ['ds-2'] },
      { id: 'ds-2', title: '2. Node Consensus (Raft Engine)', desc: 'Design leader election timeout states, heartbeat sequences, and majority quorum validation.', resourceId: 'raft-consensus-protocol', connections: ['ds-3'] },
      { id: 'ds-3', title: '3. Formal Architecture Audits', desc: 'Execute architectural review pipelines using rigorous trade-off reviews and safety constraints.', resourceId: 'system-review-prompts', connections: [] }
    ]
  }
];
