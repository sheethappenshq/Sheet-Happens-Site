import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import RetroButton from './RetroButton';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    console.log('Contact form submitted:', data);
    
    // todo: remove mock functionality - implement real email sending
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitted(true);
    setIsSubmitting(false);
    form.reset();
  };

  if (submitted) {
    return (
      <section className="py-12 px-4 bg-background">
        <div className="max-w-2xl mx-auto">
          <Card className="border-4 border-accent">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-accent mb-4 uppercase">
                MESSAGE SENT! 📧
              </h2>
              <p className="text-muted-foreground mb-6">
                Thanks for reaching out! We'll get back to you faster than you can say "emergency cheat sheet"!
              </p>
              <RetroButton
                variant="primary"
                onClick={() => setSubmitted(false)}
                data-testid="button-send-another"
              >
                SEND ANOTHER MESSAGE
              </RetroButton>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 bg-background">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-accent text-center mb-8 uppercase tracking-wider">
          📞 GET IN TOUCH 📞
        </h2>
        
        <Card className="border-4 border-card-border">
          <CardHeader>
            <CardTitle className="text-xl text-primary uppercase text-center">
              Emergency Inquiry Form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-accent font-bold uppercase">Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your Name"
                          className="border-2 border-muted bg-muted/20"
                          data-testid="input-name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-accent font-bold uppercase">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your.email@example.com"
                          className="border-2 border-muted bg-muted/20"
                          data-testid="input-email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-accent font-bold uppercase">Subject</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="What's your emergency?"
                          className="border-2 border-muted bg-muted/20"
                          data-testid="input-subject"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-accent font-bold uppercase">Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your study emergency..."
                          className="border-2 border-muted bg-muted/20 min-h-[120px]"
                          data-testid="input-message"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="text-center">
                  <RetroButton
                    type="submit"
                    variant="glow"
                    size="lg"
                    disabled={isSubmitting}
                    data-testid="button-submit"
                  >
                    {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
                  </RetroButton>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}