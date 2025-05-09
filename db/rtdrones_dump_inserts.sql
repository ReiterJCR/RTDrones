--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    type character varying(100) NOT NULL,
    price numeric(10,2) NOT NULL,
    availablefor character varying(50)[] NOT NULL,
    imageurl character varying(255)
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.products VALUES ('059b25d3-eaec-42eb-a834-7e62dbb89879', 'SkyHawk Pro', 'Photography', 799.99, '{Buy,Rent}', 'images/SkyHawkPro.png');
INSERT INTO public.products VALUES ('3c4ee4af-64ec-4a75-b415-fde0e7bd4e47', 'Racer Z1', 'Racing', 499.99, '{Buy}', 'images/racerz1.png');
INSERT INTO public.products VALUES ('f0648d18-dd05-47fb-a3ec-753a3830a100', 'IndustriX', 'Commercial', 2499.99, '{Buy,Rent}', 'images/IndustriX.png');
INSERT INTO public.products VALUES ('7dc1aeb4-00c5-4018-a2a1-57f109314207', 'MiniScout', 'Photography', 299.99, '{Buy,Rent}', 'images/MiniScout.jpg');


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

