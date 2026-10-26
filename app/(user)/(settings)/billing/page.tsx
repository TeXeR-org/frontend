"use client"

import { RouteSkeleton } from "@/components/essential/layout/RouteSkeleton"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { CreditCard, Check, Clock, Zap, History, InfinityIcon } from "@/components/icons";
import { usePlansActive } from "@/hooks/usePlansActive"
import { usageAPI, billingAPI } from "@/lib/api"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton, SkeletonText } from "@/components/ui/skeleton"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { DataTable, asTime, type Column } from "@/components/ui/data-table"
import { RelativeTime } from "@/components/ui/time"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { siteConfig } from "@/config/site"
import { PLANS, YEARLY_SAVING, formatPrice } from "@/lib/plans"
import { PageHeader } from "@/components/essential/layout/PageHeader"

function BillingContent() {
  const { user, isAuthenticated } = useAuth()
  const searchParams = useSearchParams()
  const [isAnnual, setIsAnnual] = useState(false)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [usageData, setUsageData] = useState<any>(null)
  const [loadingUsage, setLoadingUsage] = useState(true)
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])
  const [paymentHistory, setPaymentHistory] = useState<any[]>([])
  const [paymentsLoaded, setPaymentsLoaded] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)
  // Paused (or not known yet): the plans show, and nothing can be bought.
  const plansActive = usePlansActive() === true

  // Current subscription is based on user data
  const currentPlan = (user as any)?.subscriptionType || "free"

  // Handle Stripe redirect params
  useEffect(() => {
    const success = searchParams.get("success")
    const canceled = searchParams.get("canceled")
    if (success === "true") {
      toast.success("Subscription activated successfully")
      window.history.replaceState({}, "", "/billing")
    } else if (canceled === "true") {
      toast.info("Checkout was canceled")
      window.history.replaceState({}, "", "/billing")
    }
  }, [searchParams])

  // Fetch usage data
  useEffect(() => {
    if (isAuthenticated) {
      usageAPI.getCurrentUsage()
        .then((data) => {
          setUsageData(data)
          setLoadingUsage(false)
        })
        .catch((error) => {
          console.error("Failed to fetch usage:", error)
          setLoadingUsage(false)
        })
    }
  }, [isAuthenticated])

  // Fetch payment methods and history
  useEffect(() => {
    if (isAuthenticated && currentPlan !== "free") {
      Promise.all([
        billingAPI.getPaymentMethods().catch(() => []),
        billingAPI.getPaymentHistory().catch(() => []),
      ]).then(([methods, history]) => {
        setPaymentMethods(Array.isArray(methods) ? methods : [])
        setPaymentHistory(Array.isArray(history) ? history : [])
      }).finally(() => setPaymentsLoaded(true))
    }
  }, [isAuthenticated, currentPlan])

  // Nothing is fetched for a free plan or without a sign-in, so there is nothing to wait for
  const loadingPayments = isAuthenticated && currentPlan !== "free" && !paymentsLoaded

  // Format usage data for display
  const formatUsageData = () => {
    if (!usageData) {
      return {
        snips: 0,
        totalSnips: 20,
        pdfPages: 0,
        totalPdfPages: 40,
      }
    }

    return {
      snips: usageData.snipsLimit === -1 ? "Unlimited" : usageData.snipsUsed,
      totalSnips: usageData.snipsLimit === -1 ? "Unlimited" : usageData.snipsLimit,
      pdfPages: usageData.pdfPagesLimit === -1 ? "Unlimited" : usageData.pdfPagesUsed,
      totalPdfPages: usageData.pdfPagesLimit === -1 ? "Unlimited" : usageData.pdfPagesLimit,
    }
  }

  const displayUsageData = formatUsageData()

  const handleUpgrade = async (planName: string, planType: "pro" | "team") => {
    if (!isAuthenticated || !plansActive) return
    setIsUpgrading(true)
    try {
      const { url } = await billingAPI.createCheckoutSession({
        plan: planType,
        interval: isAnnual ? "yearly" : "monthly",
      })
      if (url) {
        window.location.assign(url)
      } else {
        toast.error("Failed to start checkout")
        setIsUpgrading(false)
      }
    } catch (err) {
      toast.error("Failed to start checkout. Please try again.")
      setIsUpgrading(false)
    }
  }

  const openBillingPortal = async () => {
    if (!isAuthenticated) return
    setPortalLoading(true)
    try {
      const { url } = await billingAPI.createPortalSession()
      if (url) window.location.assign(url)
      else toast.error("Failed to open billing portal")
    } catch {
      toast.error("Failed to open billing portal")
    } finally {
      setPortalLoading(false)
    }
  }

  const defaultPaymentMethod = paymentMethods?.[0]
  const cardDisplay = defaultPaymentMethod?.card
    ? `${defaultPaymentMethod.card.brand} ending in ${defaultPaymentMethod.card.last4}`
    : null
  const cardExpiry = defaultPaymentMethod?.card
    ? `${String(defaultPaymentMethod.card.exp_month).padStart(2, "0")}/${defaultPaymentMethod.card.exp_year}`
    : null


  return (
    <Container>
      <div className="space-y-6">
        {/* Header */}
        <PageHeader title="Billing" description="Your plan, usage, and invoices." />

        {/* Current Plan & Usage Overview */}
        <div className="grid grid-cols-1 gap-4 @3xl:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Current plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-semibold text-2xl capitalize mb-1">
                {currentPlan === "free" ? "Free" : currentPlan}
              </div>
              <p className="text-muted-foreground text-sm mb-3">
                {PLANS.find((p) => p.id === currentPlan)?.tagline ??
                  "Everything in Team, with custom terms"}
              </p>
              {currentPlan !== "free" && (
                <Badge variant="outline">
                  Active
                </Badge>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Monthly usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loadingUsage ? (
                // Two meters' shape: a label line over a bar, as below.
                <div role="status" aria-label="Loading usage" className="space-y-3">
                  {["Image snips", "PDF pages"].map((label) => (
                    <div key={label}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <SkeletonText className="flex-1" width="40%" />
                        <SkeletonText className="w-16" width="100%" />
                      </div>
                      <Skeleton className="h-1.5 w-full rounded-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Image snips</span>
                      <span className="font-medium">
                        {typeof displayUsageData.snips === 'string' ? (
                          <span className="flex items-center gap-1">
                            <InfinityIcon className="h-4 w-4" />
                            Unlimited
                          </span>
                        ) : (
                          `${displayUsageData.snips} / ${displayUsageData.totalSnips}`
                        )}
                      </span>
                    </div>
                    {typeof displayUsageData.snips === 'number' && (
                      <div className="w-full bg-surface rounded-full h-1.5">
                        <div
                          className="bg-accent h-1.5 rounded-full"
                          style={{ width: `${((displayUsageData.snips as number) / (displayUsageData.totalSnips as number)) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">PDF pages</span>
                      <span className="font-medium">
                        {typeof displayUsageData.pdfPages === 'string' ? (
                          <span className="flex items-center gap-1">
                            <InfinityIcon className="h-4 w-4" />
                            Unlimited
                          </span>
                        ) : (
                          `${displayUsageData.pdfPages} / ${displayUsageData.totalPdfPages}`
                        )}
                      </span>
                    </div>
                    {typeof displayUsageData.pdfPages === 'number' && (
                      <div className="w-full bg-surface rounded-full h-1.5">
                        <div
                          className="bg-accent h-1.5 rounded-full"
                          style={{ width: `${((displayUsageData.pdfPages as number) / (displayUsageData.totalPdfPages as number)) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Payment method</CardTitle>
            </CardHeader>
            {/* As tall as a card's two lines in every state, so the row of cards keeps its height while the card on file loads. */}
            <CardContent className="flex min-h-9 items-center justify-center">
              {currentPlan === "free" ? (
                <div className="flex items-center">
                  <p className="text-muted-foreground text-sm">No payment method added</p>
                </div>
              ) : loadingPayments ? (
                <div role="status" aria-label="Loading payment method" className="flex w-48 items-center space-x-3">
                  <Skeleton className="size-5 shrink-0" />
                  <div className="flex-1">
                    <SkeletonText className="text-sm" width="100%" />
                    <SkeletonText className="text-xs" width="60%" />
                  </div>
                </div>
              ) : cardDisplay ? (
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm capitalize">{cardDisplay}</p>
                    {cardExpiry && (
                      <p className="text-muted-foreground text-xs">Expires {cardExpiry}</p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No payment method on file</p>
              )}
            </CardContent>
            <CardFooter className="pt-0">
              <Button
                variant="outline"
                size="lg"
                disabled={currentPlan === "free" || portalLoading}
                className="w-full"
                onClick={openBillingPortal}
              >
                {portalLoading ? "Opening..." : "Manage payment method"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* While payments are being set up: why nothing can be bought, and that the Free plan is untouched. */}
        {!plansActive && (
          <section aria-labelledby="plans-paused" className="flex items-start gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklch,var(--danger)_45%,transparent)] bg-[color-mix(in_oklch,var(--danger)_10%,var(--card))] p-4">
            <span className="grid size-9 shrink-0 place-items-center rounded-[var(--radius)] border border-[color-mix(in_oklch,var(--danger)_35%,transparent)] bg-[color-mix(in_oklch,var(--danger)_16%,transparent)]">
              <Clock aria-hidden className="size-4 text-danger" />
            </span>
            <div className="flex min-w-0 flex-col gap-1">
              <h2 id="plans-paused" className="type-base font-medium text-danger">Paid plans are coming soon</h2>
              <p className="type-base text-pretty text-muted-foreground">
                We are sorry: upgrades are paused while we finish setting up payments. Everything on the Free plan works as usual, and nothing is charged. Pro and Team open here as soon as they are ready; questions go to{" "}
                <a href={siteConfig.contact.support} className="font-medium text-foreground underline underline-offset-4">
                  {siteConfig.contact.support.replace(/^mailto:/, "")}
                </a>
                .
              </p>
            </div>
          </section>
        )}

        {/* Billing Toggle */}
        <div className={`flex items-center justify-center gap-3 py-4 ${plansActive ? "" : "hidden"}`}>
          <span className={`text-sm font-medium ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
            Monthly
          </span>
          <Switch
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
          />
          <span className={`text-sm font-medium ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
            Annual
          </span>
          <Badge variant="secondary" className="ms-2">Save {YEARLY_SAVING}%</Badge>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 gap-6 @3xl:grid-cols-3">
          {PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={`flex flex-col ${currentPlan === plan.id ? "border-accent" : ""}`}
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  {plan.featured && <Badge>Popular</Badge>}
                </div>
                <CardDescription>{plan.tagline}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="font-bold text-4xl">
                      {formatPrice(isAnnual ? plan.yearly : plan.monthly)}
                    </span>
                    <span className="text-muted-foreground">
                      {plan.id === "free" ? "" : isAnnual ? "/year" : "/month"}
                    </span>
                  </div>
                  {plan.id !== "free" && isAnnual && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatPrice(plan.yearly / 12)} per month
                    </p>
                  )}
                </div>
                <ul className="space-y-2.5">
                  {plan.highlights.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-foreground mt-0.5 shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {plan.id === "free" ? (
                  <Button
                    className="w-full"
                    variant={currentPlan === "free" ? "outline" : "default"}
                    disabled={currentPlan === "free"}
                    onClick={currentPlan !== "free" ? openBillingPortal : undefined}
                  >
                    {currentPlan === "free" ? "Current plan" : "Manage subscription"}
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    variant={currentPlan === plan.id ? "outline" : "default"}
                    disabled={currentPlan === plan.id || isUpgrading || !plansActive}
                    onClick={() => handleUpgrade(plan.name, plan.id as "pro" | "team")}
                  >
                    {currentPlan === plan.id
                      ? "Current plan"
                      : !plansActive
                        ? "Coming soon"
                        : isUpgrading
                          ? "Redirecting..."
                          : "Upgrade"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Enterprise Plan */}
        <Card className="py-0">
          <CardContent className="flex flex-col @3xl:flex-row @3xl:items-center @3xl:justify-between gap-4 p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-accent/10 p-3">
                <Zap className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Enterprise plan</h3>
                <p className="text-muted-foreground text-sm">Customized solutions for large organizations with dedicated support</p>
              </div>
            </div>
            <Button asChild className="@3xl:w-auto">
              <a href={siteConfig.contact?.sales ?? "mailto:sales@texer.org"}>Contact sales</a>
            </Button>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Payment history</CardTitle>
            <CardDescription>
              Your recent payment history and invoices
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentPlan === "free" ? (
              <p className="flex min-h-36 items-center justify-center px-6 text-center type-base text-muted-foreground">Payments appear here once you are on a paid plan.</p>
            ) : (
              <DataTable
                label="Payment history"
                loading={loadingPayments && 3}
                empty="No payments yet."
                rows={paymentHistory}
                rowKey={(payment) => payment.id}
                defaultSort={{ column: "date", direction: "desc" }}
                columns={[
                  { id: "invoice", header: "Invoice", sortValue: (payment) => payment.stripePaymentId ?? String(payment.id), cell: (payment) => <span className="font-mono type-small select-all">{payment.stripePaymentId ? String(payment.stripePaymentId) : `#${payment.id}`}</span> },
                  { id: "date", header: "Date", sortValue: (payment) => asTime(payment.createdAt), cell: (payment) => <RelativeTime value={payment.createdAt} format="date" /> },
                  { id: "description", header: "Description", sortValue: (payment) => payment.description || "Subscription payment", cell: (payment) => <span className="text-muted-foreground">{payment.description || "Subscription payment"}</span> },
                  {
                    id: "amount",
                    header: "Amount",
                    align: "end",
                    sortValue: (payment) => payment.amount || 0,
                    cell: (payment) => new Intl.NumberFormat("en-US", { style: "currency", currency: (payment.currency || "usd").toUpperCase() }).format((payment.amount || 0) / 100),
                  },
                  {
                    id: "status",
                    header: "Status",
                    sortValue: (payment) => payment.status,
                    cell: (payment) => (
                      <Badge variant="outline" className="capitalize">
                        {payment.status}
                      </Badge>
                    ),
                  },
                ] satisfies Column<any>[]}
              />
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              variant="outline"
              disabled={currentPlan === "free" || portalLoading}
              onClick={openBillingPortal}
            >
              <History className="h-4 w-4 me-2" />
              View all invoices
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Container>
  )
}

export default function BillingPage() {
  return (
    <Suspense
      fallback={<RouteSkeleton pathname="/billing" />}
    >
      <BillingContent />
    </Suspense>
  )
}
