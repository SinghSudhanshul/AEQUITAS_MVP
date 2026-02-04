// ============================================
// AEQUITAS LV-COP WEBSOCKET CLIENT
// Real-time Data Streaming
// ============================================

import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notification.store';
import { useCrisisStore } from '@/store/crisis.store';
import { QUOTES } from '@/config/narrative';
import { WEBSOCKET } from './endpoints';

// ============================================
// TYPES & INTERFACES
// ============================================

export type WebSocketChannel =
  | 'forecasts'
  | 'market'
  | 'notifications'
  | 'crisis'
  | 'agents';

export type WebSocketStatus =
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'reconnecting'
  | 'error';

export interface WebSocketMessage<T = unknown> {
  type: string;
  channel: WebSocketChannel;
  data: T;
  timestamp: string;
  sequence?: number;
}

export interface WebSocketConfig {
  reconnectAttempts: number;
  reconnectDelay: number;
  heartbeatInterval: number;
  messageQueueSize: number;
  autoConnect: boolean;
}

export interface WebSocketSubscription {
  channel: WebSocketChannel;
  callback: (message: WebSocketMessage) => void;
  filter?: (message: WebSocketMessage) => boolean;
}

export interface WebSocketStats {
  messagesReceived: number;
  messagesSent: number;
  bytesReceived: number;
  bytesSent: number;
  reconnects: number;
  errors: number;
  latency: number;
}

// ============================================
// CONFIGURATION
// ============================================

const DEFAULT_CONFIG: WebSocketConfig = {
  reconnectAttempts: 5,
  reconnectDelay: 1000,
  heartbeatInterval: 30000,
  messageQueueSize: 100,
  autoConnect: true,
};

// ============================================
// WEBSOCKET MANAGER CLASS
// ============================================

class WebSocketManager {
  private sockets: Map<WebSocketChannel, WebSocket> = new Map();
  private subscriptions: Map<WebSocketChannel, Set<WebSocketSubscription>> = new Map();
  private messageQueues: Map<WebSocketChannel, WebSocketMessage[]> = new Map();
  private reconnectTimers: Map<WebSocketChannel, NodeJS.Timeout> = new Map();
  private heartbeatTimers: Map<WebSocketChannel, NodeJS.Timeout> = new Map();
  private config: WebSocketConfig;
  private stats: WebSocketStats;
  private statusCallbacks: Set<(channel: WebSocketChannel, status: WebSocketStatus) => void> = new Set();
  private lastPingTime: Map<WebSocketChannel, number> = new Map();
  private reconnectAttempts: Map<WebSocketChannel, number> = new Map();

  constructor(config: Partial<WebSocketConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.stats = this.initStats();

    // Initialize maps for all channels
    Object.values(WEBSOCKET).forEach((_, index) => {
      const channels: WebSocketChannel[] = ['forecasts', 'market', 'notifications', 'crisis', 'agents'];
      const channel = channels[index];
      if (channel) {
        this.subscriptions.set(channel, new Set());
        this.messageQueues.set(channel, []);
        this.reconnectAttempts.set(channel, 0);
      }
    });
  }

  private initStats(): WebSocketStats {
    return {
      messagesReceived: 0,
      messagesSent: 0,
      bytesReceived: 0,
      bytesSent: 0,
      reconnects: 0,
      errors: 0,
      latency: 0,
    };
  }

  // ============================================
  // CONNECTION MANAGEMENT
  // ============================================

  connect(channel: WebSocketChannel): void {
    if (this.sockets.has(channel)) {
      const existing = this.sockets.get(channel);
      if (existing?.readyState === WebSocket.OPEN || existing?.readyState === WebSocket.CONNECTING) {
        return; // Already connected or connecting
      }
    }

    this.notifyStatus(channel, 'connecting');

    const token = useAuthStore.getState().accessToken;
    const url = this.getChannelUrl(channel);
    const wsUrl = token ? `${url}?token=${token}` : url;

    try {
      const socket = new WebSocket(wsUrl);

      socket.onopen = () => this.handleOpen(channel, socket);
      socket.onmessage = (event) => this.handleMessage(channel, event);
      socket.onclose = (event) => this.handleClose(channel, event);
      socket.onerror = (event) => this.handleError(channel, event);

      this.sockets.set(channel, socket);
    } catch (error) {
      console.error(`[WebSocket] Failed to connect to ${channel}:`, error);
      this.notifyStatus(channel, 'error');
      this.scheduleReconnect(channel);
    }
  }

  disconnect(channel: WebSocketChannel): void {
    const socket = this.sockets.get(channel);

    if (socket) {
      // Clear timers
      this.clearTimers(channel);

      // Close socket
      socket.close(1000, 'Client disconnect');
      this.sockets.delete(channel);

      this.notifyStatus(channel, 'disconnected');
    }
  }

  disconnectAll(): void {
    for (const channel of this.sockets.keys()) {
      this.disconnect(channel);
    }
  }

  reconnect(channel: WebSocketChannel): void {
    this.disconnect(channel);
    this.connect(channel);
  }

  private getChannelUrl(channel: WebSocketChannel): string {
    const urls: Record<WebSocketChannel, string> = {
      forecasts: WEBSOCKET.FORECASTS,
      market: WEBSOCKET.MARKET,
      notifications: WEBSOCKET.NOTIFICATIONS,
      crisis: WEBSOCKET.CRISIS,
      agents: WEBSOCKET.AGENTS,
    };
    return urls[channel];
  }

  // ============================================
  // EVENT HANDLERS
  // ============================================

  private handleOpen(channel: WebSocketChannel, socket: WebSocket): void {
    console.log(`[WebSocket] Connected to ${channel}`);

    this.notifyStatus(channel, 'connected');
    this.reconnectAttempts.set(channel, 0);

    // Start heartbeat
    this.startHeartbeat(channel, socket);

    // Send any queued messages
    this.flushMessageQueue(channel);

    // Notify user for important channels
    if (channel === 'crisis') {
      useNotificationStore.getState().addNotification({
        type: 'info',
        title: 'Crisis Channel Connected',
        message: 'Real-time crisis monitoring is now active.',
        persona: 'donna',
        quote: QUOTES.DONNA.PROACTIVE,
      });
    }
  }

  private handleMessage(channel: WebSocketChannel, event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);

      // Update stats
      this.stats.messagesReceived++;
      this.stats.bytesReceived += event.data.length;

      // Handle heartbeat response
      if (message.type === 'pong') {
        const pingTime = this.lastPingTime.get(channel);
        if (pingTime) {
          this.stats.latency = Date.now() - pingTime;
        }
        return;
      }

      // Handle crisis mode trigger
      if (message.type === 'crisis_alert') {
        this.handleCrisisAlert(message);
        return;
      }

      // Dispatch to subscribers
      const subscribers = this.subscriptions.get(channel);
      if (subscribers) {
        for (const subscription of subscribers) {
          // Apply filter if present
          if (subscription.filter && !subscription.filter(message)) {
            continue;
          }

          try {
            subscription.callback(message);
          } catch (error) {
            console.error(`[WebSocket] Subscriber error on ${channel}:`, error);
          }
        }
      }

      // Store in queue for late subscribers
      const queue = this.messageQueues.get(channel);
      if (queue) {
        queue.push(message);
        if (queue.length > this.config.messageQueueSize) {
          queue.shift();
        }
      }

    } catch (error) {
      console.error(`[WebSocket] Failed to parse message on ${channel}:`, error);
      this.stats.errors++;
    }
  }

  private handleClose(channel: WebSocketChannel, event: CloseEvent): void {
    console.log(`[WebSocket] Disconnected from ${channel}: ${event.code} ${event.reason}`);

    this.clearTimers(channel);
    this.sockets.delete(channel);

    // Check if we should reconnect
    if (!event.wasClean && event.code !== 1000) {
      this.notifyStatus(channel, 'reconnecting');
      this.scheduleReconnect(channel);
    } else {
      this.notifyStatus(channel, 'disconnected');
    }
  }

  private handleError(channel: WebSocketChannel, _event: Event): void {
    console.error(`[WebSocket] Error on ${channel}`);

    this.stats.errors++;
    this.notifyStatus(channel, 'error');

    // Notify for important channels
    if (channel === 'market' || channel === 'crisis') {
      useNotificationStore.getState().addNotification({
        type: 'warning',
        title: 'Connection Issue',
        message: `${channel} data stream interrupted. Attempting to reconnect...`,
        persona: 'donna',
        quote: QUOTES.DONNA.COMFORT,
      });
    }
  }

  private handleCrisisAlert(message: WebSocketMessage): void {
    const crisisStore = useCrisisStore.getState();

    // Activate paranoia mode
    const reason = `Trigger: ${message.type}, Severity: ${(message.data as { severity?: string })?.severity || 'high'}`;
    crisisStore.activateParanoiaMode(reason);

    // Play alert sound
    const audio = new Audio('/sounds/elevator_chime.mp3');
    audio.play().catch(() => {
      // Audio blocked, ignore
    });

    // Notify with Harvey quote
    useNotificationStore.getState().addNotification({
      type: 'error',
      title: 'CRISIS ALERT',
      message: 'Market conditions require immediate attention.',
      persona: 'harvey',
      quote: QUOTES.HARVEY.HIGH_VOLATILITY,
    });
  }

  // ============================================
  // HEARTBEAT & RECONNECTION
  // ============================================

  private startHeartbeat(channel: WebSocketChannel, socket: WebSocket): void {
    const timer = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        this.lastPingTime.set(channel, Date.now());
        socket.send(JSON.stringify({ type: 'ping', timestamp: new Date().toISOString() }));
      }
    }, this.config.heartbeatInterval);

    this.heartbeatTimers.set(channel, timer);
  }

  private scheduleReconnect(channel: WebSocketChannel): void {
    const attempts = this.reconnectAttempts.get(channel) || 0;

    if (attempts >= this.config.reconnectAttempts) {
      console.error(`[WebSocket] Max reconnect attempts reached for ${channel}`);
      this.notifyStatus(channel, 'error');

      useNotificationStore.getState().addNotification({
        type: 'error',
        title: 'Connection Failed',
        message: `Unable to connect to ${channel} after ${attempts} attempts.`,
        persona: 'harvey',
        quote: QUOTES.HARVEY.ERROR,
      });

      return;
    }

    const delay = this.config.reconnectDelay * Math.pow(2, attempts);

    console.log(`[WebSocket] Scheduling reconnect for ${channel} in ${delay}ms (attempt ${attempts + 1})`);

    const timer = setTimeout(() => {
      this.reconnectAttempts.set(channel, attempts + 1);
      this.stats.reconnects++;
      this.connect(channel);
    }, delay);

    this.reconnectTimers.set(channel, timer);
  }

  private clearTimers(channel: WebSocketChannel): void {
    const reconnectTimer = this.reconnectTimers.get(channel);
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      this.reconnectTimers.delete(channel);
    }

    const heartbeatTimer = this.heartbeatTimers.get(channel);
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      this.heartbeatTimers.delete(channel);
    }
  }

  // ============================================
  // SUBSCRIPTION MANAGEMENT
  // ============================================

  subscribe(subscription: WebSocketSubscription): () => void {
    const { channel, callback, filter } = subscription;

    // Get or create subscription set for channel
    let subscribers = this.subscriptions.get(channel);
    if (!subscribers) {
      subscribers = new Set();
      this.subscriptions.set(channel, subscribers);
    }

    // Add subscription
    const sub: WebSocketSubscription = { channel, callback, filter };
    subscribers.add(sub);

    // Connect if not already
    if (!this.sockets.has(channel)) {
      this.connect(channel);
    }

    // Return unsubscribe function
    return () => {
      subscribers?.delete(sub);

      // Disconnect if no more subscribers
      if (subscribers?.size === 0) {
        // Keep connection for a bit in case of quick resubscribe
        setTimeout(() => {
          if (subscribers?.size === 0) {
            this.disconnect(channel);
          }
        }, 5000);
      }
    };
  }

  unsubscribeAll(channel: WebSocketChannel): void {
    const subscribers = this.subscriptions.get(channel);
    if (subscribers) {
      subscribers.clear();
    }
  }

  // ============================================
  // MESSAGE SENDING
  // ============================================

  send(channel: WebSocketChannel, message: Record<string, unknown>): boolean {
    const socket = this.sockets.get(channel);

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      // Queue message for later
      const queue = this.messageQueues.get(channel);
      if (queue) {
        queue.push({
          type: 'outbound',
          channel,
          data: message,
          timestamp: new Date().toISOString(),
        });
      }
      return false;
    }

    const payload = JSON.stringify(message);
    socket.send(payload);

    this.stats.messagesSent++;
    this.stats.bytesSent += payload.length;

    return true;
  }

  private flushMessageQueue(channel: WebSocketChannel): void {
    const queue = this.messageQueues.get(channel);
    const socket = this.sockets.get(channel);

    if (!queue || !socket || socket.readyState !== WebSocket.OPEN) {
      return;
    }

    // Send queued outbound messages
    const outbound = queue.filter(m => m.type === 'outbound');
    for (const message of outbound) {
      socket.send(JSON.stringify(message.data));
    }

    // Remove outbound messages from queue
    const remaining = queue.filter(m => m.type !== 'outbound');
    this.messageQueues.set(channel, remaining);
  }

  // ============================================
  // STATUS & STATS
  // ============================================

  onStatusChange(callback: (channel: WebSocketChannel, status: WebSocketStatus) => void): () => void {
    this.statusCallbacks.add(callback);
    return () => this.statusCallbacks.delete(callback);
  }

  private notifyStatus(channel: WebSocketChannel, status: WebSocketStatus): void {
    for (const callback of this.statusCallbacks) {
      try {
        callback(channel, status);
      } catch (error) {
        console.error('[WebSocket] Status callback error:', error);
      }
    }
  }

  getStatus(channel: WebSocketChannel): WebSocketStatus {
    const socket = this.sockets.get(channel);

    if (!socket) {
      return 'disconnected';
    }

    switch (socket.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
      case WebSocket.CLOSED:
        return 'disconnected';
      default:
        return 'error';
    }
  }

  getStats(): WebSocketStats {
    return { ...this.stats };
  }

  resetStats(): void {
    this.stats = this.initStats();
  }

  getLatency(_channel: WebSocketChannel): number {
    // Return last measured latency
    return this.stats.latency;
  }

  isConnected(channel: WebSocketChannel): boolean {
    return this.getStatus(channel) === 'connected';
  }

  // ============================================
  // CONFIGURATION
  // ============================================

  updateConfig(config: Partial<WebSocketConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfig(): WebSocketConfig {
    return { ...this.config };
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

export const wsManager = new WebSocketManager();

// ============================================
// CONVENIENCE HOOKS/FUNCTIONS
// ============================================

export function subscribeToForecasts(
  callback: (message: WebSocketMessage) => void,
  filter?: (message: WebSocketMessage) => boolean
): () => void {
  return wsManager.subscribe({
    channel: 'forecasts',
    callback,
    filter,
  });
}

export function subscribeToMarket(
  callback: (message: WebSocketMessage) => void,
  filter?: (message: WebSocketMessage) => boolean
): () => void {
  return wsManager.subscribe({
    channel: 'market',
    callback,
    filter,
  });
}

export function subscribeToCrisis(
  callback: (message: WebSocketMessage) => void
): () => void {
  return wsManager.subscribe({
    channel: 'crisis',
    callback,
  });
}

export function subscribeToAgents(
  callback: (message: WebSocketMessage) => void,
  agentType?: 'harvey' | 'donna'
): () => void {
  return wsManager.subscribe({
    channel: 'agents',
    callback,
    filter: agentType
      ? (m) => (m.data as { agent?: string })?.agent === agentType
      : undefined,
  });
}

export default wsManager;
