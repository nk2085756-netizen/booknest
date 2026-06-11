import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { createRoute, useNavigate } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, CreditCard, Lock, Package, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import { useCartStore } from "../store/cartStore";
import { Route as rootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: CheckoutPage,
});

type PaymentMethod = "visa" | "mastercard" | "paypal";

interface FormState {
  email: string;
  fullName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  paymentMethod: PaymentMethod;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

interface FormErrors {
  email?: string;
  fullName?: string;
  address1?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
}

const TAX_RATE = 0.08;

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.email.trim()) errors.email = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(form.email))
    errors.email = "Enter a valid email";
  if (!form.fullName.trim()) errors.fullName = "Full name is required";
  if (!form.address1.trim()) errors.address1 = "Address is required";
  if (!form.city.trim()) errors.city = "City is required";
  if (!form.state.trim()) errors.state = "State / province is required";
  if (!form.zip.trim()) errors.zip = "ZIP / postal code is required";
  if (!form.country.trim()) errors.country = "Country is required";
  if (form.paymentMethod !== "paypal") {
    if (!form.cardNumber.trim()) errors.cardNumber = "Card number is required";
    else if (form.cardNumber.replace(/\s/g, "").length < 13)
      errors.cardNumber = "Enter a valid card number";
    if (!form.expiry.trim()) errors.expiry = "Expiry is required";
    else if (!/^\d{2}\s*\/\s*\d{2}$/.test(form.expiry))
      errors.expiry = "Use MM / YY format";
    if (!form.cvv.trim()) errors.cvv = "CVV is required";
    else if (form.cvv.length < 3) errors.cvv = "CVV must be 3–4 digits";
  }
  return errors;
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p
      className="text-xs text-destructive mt-1"
      role="alert"
      data-ocid="checkout.field_error"
    >
      {msg}
    </p>
  );
}

function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const clearCart = useCartStore((s) => s.clearCart);
  const navigate = useNavigate();

  const subtotal = totalPrice;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const [form, setForm] = useState<FormState>({
    email: "",
    fullName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    paymentMethod: "visa",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormState, boolean>>
  >({});

  const set =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (touched[field]) {
        const newForm = { ...form, [field]: e.target.value };
        const newErrors = validate(newForm as FormState);
        setErrors((prev) => ({
          ...prev,
          [field]: newErrors[field as keyof FormErrors],
        }));
      }
    };

  const blur = (field: keyof FormState) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validate(form);
    setErrors((prev) => ({
      ...prev,
      [field]: newErrors[field as keyof FormErrors],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = Object.fromEntries(
      Object.keys(form).map((k) => [k, true]),
    ) as Partial<Record<keyof FormState, boolean>>;
    setTouched(allTouched);
    const newErrors = validate(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix the errors before placing your order");
      return;
    }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    const orderNum = `BN-${String(Math.floor(10000 + Math.random() * 90000))}`;
    clearCart();
    void navigate({
      to: "/order-confirmation",
      search: { orderId: orderNum, customerName: form.fullName },
    });
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center py-24">
          <div className="text-center space-y-4">
            <h2 className="font-display text-2xl font-bold text-foreground">
              Your cart is empty
            </h2>
            <p className="text-muted-foreground text-sm">
              Add some books before checking out.
            </p>
            <Button
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth"
            >
              <Link to="/books">Browse Books</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-card border-b border-border/60 py-6">
        <div className="container max-w-5xl">
          <Link
            to="/cart"
            data-ocid="checkout.back_to_cart_link"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded w-fit mb-3"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                Secure Checkout
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                <Lock className="h-3 w-3" />
                256-bit SSL encryption
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background py-8 flex-1">
        <div className="container max-w-5xl">
          <form
            onSubmit={(e) => void handleSubmit(e)}
            noValidate
            data-ocid="checkout.form"
          >
            <div className="grid lg:grid-cols-[1fr_340px] gap-8">
              {/* ── Left: billing form ── */}
              <div className="space-y-6">
                {/* Contact info */}
                <section className="bg-card border border-border/50 rounded-xl p-5 shadow-subtle space-y-4">
                  <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                    Contact Information
                  </h2>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      data-ocid="checkout.email_input"
                      required
                      value={form.email}
                      onChange={set("email")}
                      onBlur={blur("email")}
                      placeholder="jane@example.com"
                      className={`h-9 text-sm bg-background ${errors.email ? "border-destructive" : ""}`}
                    />
                    <FieldError msg={errors.email} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName" className="text-sm font-medium">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      data-ocid="checkout.name_input"
                      required
                      value={form.fullName}
                      onChange={set("fullName")}
                      onBlur={blur("fullName")}
                      placeholder="Jane Austen"
                      className={`h-9 text-sm bg-background ${errors.fullName ? "border-destructive" : ""}`}
                    />
                    <FieldError msg={errors.fullName} />
                  </div>
                </section>

                {/* Shipping address */}
                <section className="bg-card border border-border/50 rounded-xl p-5 shadow-subtle space-y-4">
                  <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                    <Truck className="h-4 w-4 text-primary" />
                    Shipping Address
                  </h2>
                  <div className="space-y-1.5">
                    <Label htmlFor="address1" className="text-sm font-medium">
                      Address Line 1 <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="address1"
                      data-ocid="checkout.address_input"
                      required
                      value={form.address1}
                      onChange={set("address1")}
                      onBlur={blur("address1")}
                      placeholder="123 Library Lane"
                      className={`h-9 text-sm bg-background ${errors.address1 ? "border-destructive" : ""}`}
                    />
                    <FieldError msg={errors.address1} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="address2" className="text-sm font-medium">
                      Address Line 2{" "}
                      <span className="text-muted-foreground text-xs font-normal">
                        (optional)
                      </span>
                    </Label>
                    <Input
                      id="address2"
                      data-ocid="checkout.address2_input"
                      value={form.address2}
                      onChange={set("address2")}
                      placeholder="Apt, suite, unit, etc."
                      className="h-9 text-sm bg-background"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="city" className="text-sm font-medium">
                        City <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="city"
                        data-ocid="checkout.city_input"
                        required
                        value={form.city}
                        onChange={set("city")}
                        onBlur={blur("city")}
                        placeholder="London"
                        className={`h-9 text-sm bg-background ${errors.city ? "border-destructive" : ""}`}
                      />
                      <FieldError msg={errors.city} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="state" className="text-sm font-medium">
                        State / Province{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="state"
                        data-ocid="checkout.state_input"
                        required
                        value={form.state}
                        onChange={set("state")}
                        onBlur={blur("state")}
                        placeholder="England"
                        className={`h-9 text-sm bg-background ${errors.state ? "border-destructive" : ""}`}
                      />
                      <FieldError msg={errors.state} />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="zip" className="text-sm font-medium">
                        ZIP / Postal Code{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="zip"
                        data-ocid="checkout.zip_input"
                        required
                        value={form.zip}
                        onChange={set("zip")}
                        onBlur={blur("zip")}
                        placeholder="SW1A 1AA"
                        className={`h-9 text-sm bg-background ${errors.zip ? "border-destructive" : ""}`}
                      />
                      <FieldError msg={errors.zip} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="country" className="text-sm font-medium">
                        Country <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="country"
                        data-ocid="checkout.country_input"
                        required
                        value={form.country}
                        onChange={set("country")}
                        onBlur={blur("country")}
                        placeholder="United Kingdom"
                        className={`h-9 text-sm bg-background ${errors.country ? "border-destructive" : ""}`}
                      />
                      <FieldError msg={errors.country} />
                    </div>
                  </div>
                </section>

                {/* Payment method */}
                <section className="bg-card border border-border/50 rounded-xl p-5 shadow-subtle space-y-4">
                  <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-primary" />
                    Payment Method
                  </h2>

                  {/* Payment selector */}
                  <div
                    className="grid grid-cols-3 gap-2.5"
                    data-ocid="checkout.payment_method_selector"
                  >
                    {(["visa", "mastercard", "paypal"] as PaymentMethod[]).map(
                      (method) => (
                        <button
                          key={method}
                          type="button"
                          data-ocid={`checkout.payment_${method}_button`}
                          onClick={() =>
                            setForm((p) => ({ ...p, paymentMethod: method }))
                          }
                          className={`relative flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                            form.paymentMethod === method
                              ? "border-primary bg-primary/5 shadow-subtle"
                              : "border-border/50 hover:border-border hover:bg-muted/30"
                          }`}
                        >
                          {method === "visa" && (
                            <span className="text-[1.35rem] font-black italic tracking-tighter text-primary">
                              VISA
                            </span>
                          )}
                          {method === "mastercard" && (
                            <span className="flex items-center">
                              <span className="w-5 h-5 rounded-full bg-primary opacity-90 -mr-2 block" />
                              <span className="w-5 h-5 rounded-full bg-accent opacity-90 block" />
                            </span>
                          )}
                          {method === "paypal" && (
                            <span className="text-sm font-extrabold text-primary tracking-tight">
                              Pay
                              <span className="text-muted-foreground">Pal</span>
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground capitalize">
                            {method}
                          </span>
                          {form.paymentMethod === method && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
                          )}
                        </button>
                      ),
                    )}
                  </div>

                  {form.paymentMethod !== "paypal" && (
                    <div className="space-y-4 pt-1">
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="cardNumber"
                          className="text-sm font-medium"
                        >
                          Card Number{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="cardNumber"
                          data-ocid="checkout.card_input"
                          required
                          value={form.cardNumber}
                          onChange={set("cardNumber")}
                          onBlur={blur("cardNumber")}
                          placeholder="4242 4242 4242 4242"
                          maxLength={19}
                          className={`h-9 text-sm bg-background font-mono ${errors.cardNumber ? "border-destructive" : ""}`}
                        />
                        <FieldError msg={errors.cardNumber} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label
                            htmlFor="expiry"
                            className="text-sm font-medium"
                          >
                            Expiry Date{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="expiry"
                            data-ocid="checkout.expiry_input"
                            required
                            value={form.expiry}
                            onChange={set("expiry")}
                            onBlur={blur("expiry")}
                            placeholder="MM / YY"
                            maxLength={7}
                            className={`h-9 text-sm bg-background font-mono ${errors.expiry ? "border-destructive" : ""}`}
                          />
                          <FieldError msg={errors.expiry} />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="cvv" className="text-sm font-medium">
                            CVV <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="cvv"
                            data-ocid="checkout.cvv_input"
                            required
                            value={form.cvv}
                            onChange={set("cvv")}
                            onBlur={blur("cvv")}
                            placeholder="•••"
                            maxLength={4}
                            className={`h-9 text-sm bg-background font-mono ${errors.cvv ? "border-destructive" : ""}`}
                          />
                          <FieldError msg={errors.cvv} />
                        </div>
                      </div>
                    </div>
                  )}

                  {form.paymentMethod === "paypal" && (
                    <div className="bg-muted/40 border border-border/50 rounded-lg p-4 text-sm text-muted-foreground text-center">
                      You'll be redirected to PayPal to complete your payment
                      securely.
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 pt-1">
                    <Lock className="h-3 w-3 shrink-0" />
                    Your payment information is encrypted with 256-bit SSL.
                  </p>
                </section>
              </div>

              {/* ── Right: order summary ── */}
              <div className="lg:sticky lg:top-20 h-fit space-y-4">
                <div className="bg-card border border-border/50 rounded-xl p-5 shadow-subtle">
                  <h2 className="font-display text-base font-bold text-foreground mb-4 flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    Order Summary
                  </h2>

                  <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                    {items.map((item) => (
                      <div
                        key={item.bookId}
                        className="flex gap-3 items-center"
                      >
                        <img
                          src={item.coverUrl}
                          alt={item.title}
                          className="w-9 h-13 object-cover rounded shadow-subtle shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground line-clamp-2 leading-tight">
                            {item.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            × {item.qty}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-foreground shrink-0">
                          ${(item.price * item.qty).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-3 bg-border/40" />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground font-medium">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Estimated Tax (8%)
                      </span>
                      <span className="text-foreground font-medium">
                        ${tax.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-accent font-semibold">Free</span>
                    </div>
                  </div>

                  <Separator className="my-3 bg-border/40" />

                  <div className="flex justify-between font-bold text-foreground">
                    <span>Total</span>
                    <span className="text-primary text-lg">
                      ${total.toFixed(2)}
                    </span>
                  </div>

                  <Button
                    type="submit"
                    data-ocid="checkout.place_order_button"
                    disabled={isSubmitting}
                    className="w-full mt-5 bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth shadow-elevated gap-2 disabled:opacity-60"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin inline-block w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" />
                        Placing Order…
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        Place Order
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
