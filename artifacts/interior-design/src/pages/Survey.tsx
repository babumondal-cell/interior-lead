import React, { useState } from "react";
import { useLocation, Link } from "wouter";
import { useSubmitLead } from "@workspace/api-client-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, ArrowRight, Home as HomeIcon, Hammer, Paintbrush } from "lucide-react";

// Types
const ProjectTypeEnum = z.enum(["new_construction", "renovation", "redecoration"]);
const BudgetEnum = z.enum(["under_10k", "10k_25k", "25k_50k", "50k_100k", "over_100k"]);
const TimelineEnum = z.enum(["immediately", "1_3_months", "3_6_months", "6_12_months", "flexible"]);
const StyleEnum = z.enum(["modern", "contemporary", "traditional", "scandinavian", "industrial", "bohemian", "minimalist", "mid_century"]);

const formSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  projectType: ProjectTypeEnum,
  roomTypes: z.array(z.string()).min(1, "Select at least one room"),
  budget: BudgetEnum,
  timeline: TimelineEnum,
  style: StyleEnum,
  squareFootage: z.coerce.number().nullable().optional(),
  description: z.string().min(10, "Please provide a brief description"),
  hearAboutUs: z.string().nullable().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ROOMS = [
  "Living Room", "Kitchen", "Primary Bedroom", "Guest Bedroom", 
  "Primary Bathroom", "Guest Bathroom", "Dining Room", "Home Office", "Outdoor"
];

const STYLES = [
  { id: "modern", label: "Modern", img: "/images/style-modern.png" },
  { id: "contemporary", label: "Contemporary", img: "/images/style-contemporary.png" },
  { id: "traditional", label: "Traditional", img: "/images/style-traditional.png" },
  { id: "scandinavian", label: "Scandinavian", img: "/images/style-scandinavian.png" },
  { id: "industrial", label: "Industrial", img: "/images/style-industrial.png" },
  { id: "bohemian", label: "Bohemian", img: "/images/style-bohemian.png" },
  { id: "minimalist", label: "Minimalist", img: "/images/style-minimalist.png" },
  { id: "mid_century", label: "Mid-Century", img: "/images/style-mid-century.png" },
];

export default function Survey() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const submitLead = useSubmitLead();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "", lastName: "", email: "", phone: "",
      projectType: "renovation", roomTypes: [],
      budget: "25k_50k", timeline: "3_6_months", style: "minimalist",
      squareFootage: null, description: "", hearAboutUs: ""
    },
  });

  const TOTAL_STEPS = 5;

  const nextStep = async () => {
    const fields = getFieldsForStep(step);
    const isValid = await form.trigger(fields as any);
    if (isValid) setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const getFieldsForStep = (s: number) => {
    switch (s) {
      case 1: return ["firstName", "lastName", "email", "phone"];
      case 2: return ["projectType"];
      case 3: return ["roomTypes"];
      case 4: return ["style", "budget", "timeline", "squareFootage"];
      case 5: return ["description", "hearAboutUs"];
      default: return [];
    }
  };

  const onSubmit = (data: FormValues) => {
    submitLead.mutate(
      { data },
      {
        onSuccess: () => {
          setLocation("/thank-you");
        },
      }
    );
  };

  const formValues = form.getValues();

  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      <nav className="w-full px-8 py-6 flex justify-between items-center border-b border-border/50">
        <Link href="/">
          <div className="text-2xl font-serif text-foreground tracking-widest uppercase cursor-pointer">Lumière</div>
        </Link>
        <div className="text-sm font-light text-muted-foreground uppercase tracking-widest">
          Step {step} of {TOTAL_STEPS}
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-muted">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out" 
          style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        />
      </div>

      <main className="flex-1 flex flex-col py-12 px-6 md:px-12 max-w-5xl mx-auto w-full relative overflow-hidden">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex-1 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex-1"
              >
                {step === 1 && (
                  <div className="space-y-10">
                    <div className="space-y-4">
                      <h2 className="text-4xl font-serif text-foreground">Let's get acquainted.</h2>
                      <p className="text-muted-foreground font-light text-lg">Please provide your contact details so we can reach out.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <FormField control={form.control} name="firstName" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">First Name</FormLabel>
                          <FormControl><Input {...field} className="h-14 bg-transparent border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 text-lg" placeholder="Jane" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="lastName" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Last Name</FormLabel>
                          <FormControl><Input {...field} className="h-14 bg-transparent border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 text-lg" placeholder="Doe" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Email</FormLabel>
                          <FormControl><Input {...field} type="email" className="h-14 bg-transparent border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 text-lg" placeholder="jane@example.com" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Phone Number</FormLabel>
                          <FormControl><Input {...field} type="tel" className="h-14 bg-transparent border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 text-lg" placeholder="(555) 123-4567" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-10">
                    <div className="space-y-4">
                      <h2 className="text-4xl font-serif text-foreground">What is the nature of your project?</h2>
                      <p className="text-muted-foreground font-light text-lg">Select the option that best describes your needs.</p>
                    </div>
                    <FormField control={form.control} name="projectType" render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                              { id: "new_construction", label: "New Construction", desc: "Building from the ground up.", icon: <HomeIcon className="w-6 h-6 mb-4 opacity-70" /> },
                              { id: "renovation", label: "Renovation", desc: "Updating an existing space structurally.", icon: <Hammer className="w-6 h-6 mb-4 opacity-70" /> },
                              { id: "redecoration", label: "Redecoration", desc: "Furnishing and styling only.", icon: <Paintbrush className="w-6 h-6 mb-4 opacity-70" /> }
                            ].map((pt) => (
                              <FormItem key={pt.id}>
                                <FormControl>
                                  <RadioGroupItem value={pt.id} className="sr-only" />
                                </FormControl>
                                <Label
                                  className={`flex flex-col items-center text-center p-8 border cursor-pointer transition-all duration-300 ${field.value === pt.id ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-card text-foreground hover:border-primary/50'}`}
                                  onClick={() => field.onChange(pt.id)}
                                >
                                  {pt.icon}
                                  <span className="font-serif text-xl mb-2">{pt.label}</span>
                                  <span className="font-light text-sm text-muted-foreground">{pt.desc}</span>
                                </Label>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-10">
                    <div className="space-y-4">
                      <h2 className="text-4xl font-serif text-foreground">Which spaces require our attention?</h2>
                      <p className="text-muted-foreground font-light text-lg">Select all that apply.</p>
                    </div>
                    <FormField control={form.control} name="roomTypes" render={() => (
                      <FormItem>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {ROOMS.map((room) => (
                            <FormField key={room} control={form.control} name="roomTypes" render={({ field }) => {
                              return (
                                <FormItem key={room} className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Label
                                      className={`flex items-center justify-center p-6 border cursor-pointer text-center w-full transition-all duration-300 ${field.value?.includes(room) ? 'border-primary bg-primary text-white' : 'border-border bg-card hover:border-primary/50'}`}
                                      onClick={() => {
                                        const current = field.value || [];
                                        const updated = current.includes(room) ? current.filter((r) => r !== room) : [...current, room];
                                        field.onChange(updated);
                                      }}
                                    >
                                      <span className="font-sans font-light tracking-wide">{room}</span>
                                    </Label>
                                  </FormControl>
                                </FormItem>
                              )
                            }} />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-12">
                    <div className="space-y-4">
                      <h2 className="text-4xl font-serif text-foreground">Define your parameters.</h2>
                    </div>
                    
                    <FormField control={form.control} name="style" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground mb-4 block">Design Aesthetic</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {STYLES.map((style) => (
                              <FormItem key={style.id}>
                                <FormControl>
                                  <RadioGroupItem value={style.id} className="sr-only" />
                                </FormControl>
                                <Label
                                  className={`relative block cursor-pointer overflow-hidden group ${field.value === style.id ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                                  onClick={() => field.onChange(style.id)}
                                >
                                  <div className="aspect-[4/3] w-full">
                                    <img src={style.img} alt={style.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                                      <span className="text-white font-serif tracking-wide">{style.label}</span>
                                    </div>
                                  </div>
                                </Label>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6">
                      <FormField control={form.control} name="budget" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Investment Range</FormLabel>
                          <FormControl>
                            <select 
                              {...field} 
                              className="w-full h-14 bg-transparent border-0 border-b border-border rounded-none focus:ring-0 focus:border-primary text-lg font-light appearance-none"
                            >
                              <option value="under_10k">Under $10,000</option>
                              <option value="10k_25k">$10,000 - $25,000</option>
                              <option value="25k_50k">$25,000 - $50,000</option>
                              <option value="50k_100k">$50,000 - $100,000</option>
                              <option value="over_100k">Over $100,000</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="timeline" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Desired Timeline</FormLabel>
                          <FormControl>
                            <select 
                              {...field} 
                              className="w-full h-14 bg-transparent border-0 border-b border-border rounded-none focus:ring-0 focus:border-primary text-lg font-light appearance-none"
                            >
                              <option value="immediately">Immediately</option>
                              <option value="1_3_months">1 - 3 Months</option>
                              <option value="3_6_months">3 - 6 Months</option>
                              <option value="6_12_months">6 - 12 Months</option>
                              <option value="flexible">Flexible</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    
                    <FormField control={form.control} name="squareFootage" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Approximate Square Footage (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            value={field.value || ""} 
                            className="h-14 bg-transparent border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 text-lg w-full md:w-1/2" 
                            placeholder="e.g. 2500" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-10">
                    <div className="space-y-4">
                      <h2 className="text-4xl font-serif text-foreground">Tell us the story of your space.</h2>
                    </div>
                    
                    <FormField control={form.control} name="description" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground block mb-2">Project Vision</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            className="min-h-[150px] bg-card border-border focus-visible:ring-1 focus-visible:ring-primary rounded-none p-4 text-lg font-light resize-none" 
                            placeholder="Share your goals, challenges with the current space, and any specific requirements..." 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="hearAboutUs" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">How did you discover Lumière? (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            value={field.value || ""} 
                            className="h-14 bg-transparent border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 text-lg w-full md:w-1/2" 
                            placeholder="e.g. Architectural Digest, Instagram, Referral..." 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <div className="bg-muted p-8 mt-12">
                      <h3 className="font-serif text-xl mb-6">Submission Summary</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm font-light">
                        <div><span className="text-muted-foreground uppercase tracking-widest text-[10px] block mb-1">Name</span> {formValues.firstName} {formValues.lastName}</div>
                        <div><span className="text-muted-foreground uppercase tracking-widest text-[10px] block mb-1">Email</span> {formValues.email}</div>
                        <div><span className="text-muted-foreground uppercase tracking-widest text-[10px] block mb-1">Type</span> {formValues.projectType?.replace('_', ' ')}</div>
                        <div><span className="text-muted-foreground uppercase tracking-widest text-[10px] block mb-1">Rooms</span> {formValues.roomTypes?.join(', ') || "None selected"}</div>
                        <div><span className="text-muted-foreground uppercase tracking-widest text-[10px] block mb-1">Style</span> {formValues.style}</div>
                        <div><span className="text-muted-foreground uppercase tracking-widest text-[10px] block mb-1">Budget</span> {formValues.budget?.replace(/_/g, ' ')}</div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-16 flex items-center justify-between border-t border-border/50 pt-8">
              {step > 1 ? (
                <Button type="button" variant="ghost" onClick={prevStep} className="uppercase tracking-widest text-xs rounded-none hover:bg-transparent hover:text-primary px-0">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
              ) : <div />}

              {step < TOTAL_STEPS ? (
                <Button type="button" onClick={nextStep} className="bg-foreground text-background hover:bg-foreground/90 uppercase tracking-widest text-xs rounded-none h-12 px-8">
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={submitLead.isPending}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest text-xs rounded-none h-12 px-8"
                >
                  {submitLead.isPending ? "Submitting..." : "Submit Inquiry"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
}
