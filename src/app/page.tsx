"use client";

import { useState, useEffect, useRef } from "react";
import { useConversation } from "@elevenlabs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Mic,
  Phone,
  User,
  Bot,
  Volume2,
  Crown,
  Star,
  Zap,
  Brain,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Heart,
  Code,
  Briefcase,
  X,
  Timer,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface PremiumAgent {
  id: string;
  name: string;
  specialty: string;
  description: string;
  icon: typeof Brain;
  color: string;
  popular?: boolean;
}

// Premium Agent Library
const PREMIUM_AGENTS: PremiumAgent[] = [
  {
    id: "agent_crypto_expert",
    name: "Crypto Expert",
    specialty: "Cryptocurrency & Blockchain",
    description:
      "Deep knowledge of crypto markets, DeFi, NFTs, and blockchain technology",
    icon: TrendingUp,
    color: "from-orange-500 to-amber-500",
    popular: true,
  },
  {
    id: "agent_business_advisor",
    name: "Business Advisor",
    specialty: "Business Strategy & Growth",
    description:
      "Expert guidance on startups, scaling, marketing, and business development",
    icon: Briefcase,
    color: "from-blue-500 to-cyan-500",
    popular: true,
  },
  {
    id: "agent_health_coach",
    name: "Health Coach",
    specialty: "Wellness & Fitness",
    description:
      "Personalized health advice, nutrition guidance, and fitness planning",
    icon: Heart,
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "agent_tech_guru",
    name: "Tech Guru",
    specialty: "Technology & Programming",
    description:
      "Coding help, tech trends, software development, and AI insights",
    icon: Code,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "agent_investment_pro",
    name: "Investment Pro",
    specialty: "Stock Market & Trading",
    description:
      "Market analysis, investment strategies, and portfolio management",
    icon: DollarSign,
    color: "from-purple-500 to-violet-500",
  },
  {
    id: "agent_ecom_specialist",
    name: "E-commerce Specialist",
    specialty: "Online Business & Sales",
    description:
      "Dropshipping, Amazon FBA, digital marketing, and online store optimization",
    icon: ShoppingCart,
    color: "from-indigo-500 to-blue-500",
  },
];

// Simple Voice Animation Component
const VoiceAnimation = ({
  isActive,
  isSpeaking,
}: {
  isActive: boolean;
  isSpeaking: boolean;
}) => {
  if (!isActive) return null;

  return (
    <div className="flex items-center justify-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`w-1 rounded-full transition-all duration-300 ${
            isSpeaking ? "bg-green-500" : "bg-blue-500"
          }`}
          style={{
            height: isSpeaking
              ? `${20 + Math.sin(Date.now() * 0.01 + i) * 15}px`
              : "8px",
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
};

// Timer Component
const TimerDisplay = ({ timeLeft }: { timeLeft: number }) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full border border-orange-500/30">
      <Timer className="h-4 w-4 text-orange-500" />
      <span className="text-sm font-medium text-orange-500">
        {minutes}:{seconds.toString().padStart(2, "0")} left
      </span>
    </div>
  );
};

// Enhanced Paywall Modal Component with Products
const PaywallModal = ({
  isOpen,
  onClose,
  agents,
  onSelectAgent,
}: {
  isOpen: boolean;
  onClose: () => void;
  agents: PremiumAgent[];
  onSelectAgent: (agent: PremiumAgent) => void;
}) => {
  if (!isOpen) return null;

  const products = [
    {
      id: "ramp",
      name: "Ramp",
      category: "Corporate Card & Expense Management",
      description:
        "AI-powered expense management and corporate cards for businesses",
      logo: "💳",
      rating: 4.8,
      pricing: "Free + paid plans",
      features: [
        "Automated expense tracking",
        "Real-time spending controls",
        "Integrations with accounting software",
      ],
    },
    {
      id: "clay",
      name: "Clay.io",
      category: "Data Enrichment & Lead Generation",
      description:
        "Powerful data platform for finding and enriching leads at scale",
      logo: "🎯",
      rating: 4.9,
      pricing: "Starting at $149/month",
      features: ["50+ data sources", "AI-powered research", "CRM integrations"],
    },
    {
      id: "notion",
      name: "Notion",
      category: "Productivity & Workspace",
      description:
        "All-in-one workspace for notes, docs, and project management",
      logo: "📝",
      rating: 4.7,
      pricing: "Free + $8/user/month",
      features: [
        "Collaborative workspace",
        "Database functionality",
        "Template library",
      ],
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-background border-2 border-border rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="p-6 border-b bg-gradient-to-r from-primary/5 to-purple-500/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-primary to-purple-500 rounded-lg">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Unlock Premium Access</h2>
                <p className="text-muted-foreground">
                  Chat with AI experts and get product evaluations
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="max-h-[60vh] p-6">
          <div className="space-y-8">
            {/* AI Experts Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">AI Experts</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {agents.slice(0, 3).map((agent) => {
                  const IconComponent = agent.icon;
                  return (
                    <Card
                      key={agent.id}
                      className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group border-2 hover:border-primary/30"
                      onClick={() => onSelectAgent(agent)}
                    >
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div
                            className={`p-3 rounded-lg bg-gradient-to-r ${agent.color} text-white shadow-lg mx-auto w-fit mb-3`}
                          >
                            <IconComponent className="h-6 w-6" />
                          </div>
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <h3 className="font-semibold">{agent.name}</h3>
                            {agent.popular && (
                              <Badge
                                variant="secondary"
                                className="text-xs bg-yellow-100 text-yellow-800"
                              >
                                <Star className="h-3 w-3 mr-1" />
                                Popular
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-primary font-medium mb-2">
                            {agent.specialty}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {agent.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Products Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Product Reviews</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {products.map((product) => (
                  <Card
                    key={product.id}
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group border-2 hover:border-primary/30"
                    onClick={() => console.log("Selected product:", product.name)}
                  >
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-3xl mb-3">{product.logo}</div>
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <h3 className="font-semibold">{product.name}</h3>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-xs text-muted-foreground">
                              {product.rating}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-primary font-medium mb-2">
                          {product.category}
                        </p>
                        <p className="text-xs text-muted-foreground mb-2">
                          {product.description}
                        </p>
                        <div className="text-xs font-medium text-green-600 mb-2">
                          {product.pricing}
                        </div>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {product.features.slice(0, 2).map((feature, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-xs"
                            >
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="p-6 border-t bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Premium Access</p>
              <p className="text-sm text-muted-foreground">
                Unlimited conversations with all expert agents and detailed product evaluations
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">
                $9.99
                <span className="text-sm text-muted-foreground">/month</span>
              </p>
              <Button className="mt-2 bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 shadow-lg">
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState("");
  const [isTrialActive, setIsTrialActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds trial
  const [showPaywall, setShowPaywall] = useState(false);
  const [, setSelectedAgent] = useState<PremiumAgent | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [allowContinuousChat, setAllowContinuousChat] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const conversation = useConversation({
    onMessage: (message: { source: string; message: string }) => {
      setMessages((prev) => [
        ...prev,
        {
          role: message.source === "user" ? "user" : "assistant",
          content: message.message,
          timestamp: new Date(),
        },
      ]);
    },
    onError: (message: string) => {
      setError(message || "Conversation error");
    },
  });

  // Auto-start conversation when component mounts
  useEffect(() => {
    const autoStart = async () => {
      if (!hasStarted) {
        try {
          setError("");
          setHasStarted(true);
          setIsTrialActive(true);
          setTimeLeft(30); // Reset to 30 seconds

          await conversation.startSession({
            agentId: "agent_01jzvt0p3cfeabpr0brvn20g7z", // Default agent
            connectionType: "webrtc",
          });
        } catch (err: unknown) {
          setError(
            err instanceof Error ? err.message : "Failed to start conversation"
          );
        }
      }
    };

    autoStart();
  }, [hasStarted, conversation]);

  // Timer effect
  useEffect(() => {
    if (isTrialActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTrialActive) {
      // Trial ended
      setIsTrialActive(false);
      setShowPaywall(true);
      // Don't end session, allow continued chatting
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isTrialActive, timeLeft, conversation]);

  const startFreeTrial = async () => {
    try {
      setError("");
      setHasStarted(true);
      setIsTrialActive(true);
      setTimeLeft(30); // Reset to 30 seconds

      await conversation.startSession({
        agentId: "agent_01jzvt0p3cfeabpr0brvn20g7z", // Default agent
        connectionType: "webrtc",
      });
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to start conversation"
      );
    }
  };

  const handleSelectAgent = (agent: PremiumAgent) => {
    setSelectedAgent(agent);
    setShowPaywall(false);
    // Here you would typically handle the premium upgrade flow
    console.log("Selected agent:", agent.name);
  };

  const resetTrial = () => {
    conversation.endSession();
    setMessages([]);
    setError("");
    setIsTrialActive(false);
    setTimeLeft(30);
    setShowPaywall(false);
    setHasStarted(false);
    setAllowContinuousChat(false);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b p-4 bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-primary to-purple-500 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AI Expert Network</h1>
              <p className="text-sm text-muted-foreground">
                {isTrialActive
                  ? "Free trial active"
                  : allowContinuousChat
                  ? "Continue chatting"
                  : "Connect with specialized AI experts"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isTrialActive && <TimerDisplay timeLeft={timeLeft} />}
            <Badge
              variant={
                conversation.status === "connected" ? "default" : "secondary"
              }
              className="gap-1"
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  conversation.status === "connected"
                    ? "bg-green-500 animate-pulse"
                    : "bg-gray-400"
                }`}
              />
              {conversation.status === "connected" ? "Connected" : "Ready"}
            </Badge>
            {conversation.status === "connected" && (
              <Button onClick={resetTrial} variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-1" />
                End Chat
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6 space-y-6">
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Voice Control Center */}
        <div className="flex flex-col items-center justify-center space-y-6">
          {conversation.status === "disconnected" && !hasStarted && (
            <>
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center border-2 border-primary/30">
                <Mic className="h-12 w-12 text-primary" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">
                  Start Your Free Trial
                </h2>
                <p className="text-muted-foreground mb-4">
                  Get 30 seconds of free conversation with our AI assistant
                </p>
                <Button
                  onClick={startFreeTrial}
                  size="lg"
                  className="px-8 bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90"
                >
                  <Mic className="h-5 w-5 mr-2" />
                  Start Free Chat
                </Button>
              </div>
            </>
          )}

          {conversation.status === "connecting" && (
            <>
              <div className="w-32 h-32 rounded-full bg-yellow-500/10 flex items-center justify-center border-2 border-yellow-500/30">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-yellow-500 border-t-transparent" />
              </div>
              <p className="text-muted-foreground">
                Connecting to AI assistant...
              </p>
            </>
          )}

          {conversation.status === "connected" && (
            <>
              <div
                className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                  conversation.isSpeaking
                    ? "bg-green-500/20 border-2 border-green-500/50"
                    : "bg-blue-500/20 border-2 border-blue-500/50"
                }`}
              >
                {conversation.isSpeaking ? (
                  <Volume2 className="h-12 w-12 text-green-500" />
                ) : (
                  <Mic className="h-12 w-12 text-blue-500" />
                )}
              </div>

              {/* Voice Animation */}
              <div className="h-12 flex items-center">
                <VoiceAnimation
                  isActive={conversation.status === "connected"}
                  isSpeaking={conversation.isSpeaking}
                />
              </div>

              <div className="text-center">
                <p className="font-medium">
                  {conversation.isSpeaking
                    ? "AI is speaking..."
                    : "Listening..."}
                </p>
                <p className="text-sm text-muted-foreground">
                  {conversation.isSpeaking
                    ? "Please wait for response"
                    : "Speak now"}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Messages */}
        {messages.length > 0 && (
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Conversation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-80">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex gap-2 max-w-[80%] ${
                          message.role === "user"
                            ? "flex-row-reverse"
                            : "flex-row"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground"
                          }`}
                        >
                          {message.role === "user" ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4" />
                          )}
                        </div>
                        <div
                          className={`rounded-lg p-3 ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <div className="text-sm">{message.content}</div>
                          <div className="text-xs mt-1 opacity-70">
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Premium Agents Preview */}
        {!isTrialActive && !showPaywall && (
          <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                Premium Expert Agents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PREMIUM_AGENTS.slice(0, 3).map((agent) => {
                  const IconComponent = agent.icon;
                  return (
                    <div
                      key={agent.id}
                      className="p-3 rounded-lg border bg-card hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`p-2 rounded-lg bg-gradient-to-r ${agent.color} text-white`}
                        >
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <h4 className="font-semibold text-sm">{agent.name}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {agent.specialty}
                      </p>
                    </div>
                  );
                })}
              </div>
              <Button
                onClick={() => setShowPaywall(true)}
                className="w-full mt-4 bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90"
              >
                View All Expert Agents
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => {
          setShowPaywall(false);
          setAllowContinuousChat(true);
        }}
        agents={PREMIUM_AGENTS}
        onSelectAgent={handleSelectAgent}
      />
    </div>
  );
}
