
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Recommendations
CREATE TABLE public.recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  name TEXT NOT NULL,
  entry NUMERIC NOT NULL,
  sl NUMERIC NOT NULL,
  tp NUMERIC NOT NULL,
  price_today NUMERIC,
  diff_pct NUMERIC,
  high_pct NUMERIC,
  low_pct NUMERIC,
  status TEXT NOT NULL DEFAULT 'NEW',
  exit_date DATE,
  days INTEGER,
  profit_on_capital NUMERIC,
  mtm NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.recommendations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.recommendations TO authenticated;
GRANT ALL ON public.recommendations TO service_role;

ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read recommendations"
  ON public.recommendations FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert recommendations"
  ON public.recommendations FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update recommendations"
  ON public.recommendations FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete recommendations"
  ON public.recommendations FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX recommendations_date_idx ON public.recommendations (date DESC);
CREATE INDEX recommendations_status_idx ON public.recommendations (status);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_recommendations_updated_at
  BEFORE UPDATE ON public.recommendations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
