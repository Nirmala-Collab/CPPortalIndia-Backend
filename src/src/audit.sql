{
 "fullName": "Nirmala Yadav",
 "email": "Nirmala.yadav@lockton.com",
 "phone": "9113523800",
 "clientGroupId": "12",
 "clientId": "10",
         "roleId": "d22a0e84-2ff4-4f3a-9ae3-524251efe711",
 "authTypeId": "0ec67c24-ef1d-43c6-9be3-1b369e99d1cd",
 "relationshipManager": "",
        "claimsManager": "",
 "userType": "INTERNAL",
 "assignCorporateGroup":"",
  "endDate":"2026-09-31",
 "accessRights": [
   "15c5db8c-5562-45a9-9924-f6fa8b82d842"
 ],
 
 "isActive": true
}


{
 "fullName": "Jaideep Deshpande",
 "email": "jaideep.deshpande@lockton.com",
 "phone": "9114523800",
 "clientGroupId": "12",
 "clientId": "10",
         "roleId": "3083557b-522b-4423-ab86-55b925ad8609",
 "authTypeId": "0ec67c24-ef1d-43c6-9be3-1b369e99d1cd",
 "relationshipManager": "",
        "claimsManager": "",
 "userType": "INTERNAL",
 "assignCorporateGroup":"",
  "endDate":"2026-09-31",
 "accessRights": [
   "15c5db8c-5562-45a9-9924-f6fa8b82d842"
 ],
 
 "isActive": true
}



{
 "fullName": "Anil Mehta",
 "email": "anil.mehta@kansai.com",
 "phone": "9114523400",
 "clientGroupId": "7",
 "clientId": "5",
         "roleId": "14b2aca0-2c6a-4d8b-87d6-0b98c2e0ab76",
 "authTypeId": "09a648c4-d17a-4476-91ce-f17356268175",
 "relationshipManager": "Jaideep Despande",
        "claimsManager": "Mukul Bhatia",
 "userType": "EXTERNAL",
 "assignCorporateGroup":"",
  "endDate":"2026-09-31",
 "accessRights": [
   "4bffe94f-88de-4305-92b0-8bc5eebbc864",
"76fd80fa-0c51-407b-8356-4514168f52b6",
"ba96b89c-cb9a-4569-b399-da9da6281575",
"d3b9ddc7-9853-4afb-8b28-033676f0f892",
"e92c38ef-9879-47d4-b084-fe6d2c3b98ed",
"b8cec1fe-8396-4ccc-a520-90b8939f4c99",
"138b879c-dec0-4f2b-aa56-7f102cd52145",
"354ba91a-2e5d-47e1-82e5-cc0a080cc435",
"1e143b5a-5ad7-4098-a94d-2ad19e68b6d7",
"e28362d8-80b3-4be8-820f-136ab8846877"
 ],
 
 "isActive": true
}



INSERT INTO roles (id, role_type, role_name, description, created_at, updated_at)
VALUES
('3083557b-522b-4423-ab86-55b925ad8609', 'BUSINESS', 'RM', 'Relationship Manager', '2025-12-17 08:57:15.542838+05:30', '2025-12-17 08:57:15.542838+05:30'),
('5e94e753-16ad-48e0-a889-667ae637ba51', 'BUSINESS', 'CM', 'Claims Manager', '2025-12-17 08:57:15.542838+05:30', '2025-12-17 08:57:15.542838+05:30'),
('d22a0e84-2ff4-4f3a-9ae3-524251efe711', 'IT', 'IT ADMIN', 'IT Administrator', '2025-12-17 08:57:15.542838+05:30', '2025-12-17 08:57:15.542838+05:30'),
('14b2aca0-2c6a-4d8b-87d6-0b98c2e0ab76', 'CLIENT', 'Client User', 'External User', '2025-12-17 08:57:15.542838+05:30', '2025-12-17 08:57:15.542838+05:30'),
('8eefeb8a-7eca-4b3e-9c90-5241edf1b68c', 'BUSINESS', 'BM', 'Business manager', '2026-01-09 13:05:37.973+05:30', '2026-01-09 13:05:37.973+05:30');



INSERT INTO users (
  id,
  full_name,
  email,
  phone,
  end_date,
  relationship_manager,
  claims_manager,
  role_id,
  auth_type_id,
  user_type,
  is_active,
  created_at,
  updated_at
)
VALUES
-- 1) Nirmala Yadav
('269e67b2-d95a-4902-a61b-d04da79ad923',
 'Nirmala Yadav',
 'Nirmala.yadav@lockton.com',
 '9113593800',
 '2026-10-01 05:30:00+05:30',
 NULL,
 NULL,
 'd22a0e84-2ff4-4f3a-9ae3-524251efe711',
 '0ec67c24-ef1d-43c6-9be3-1b369e99d1cd',
 'INTERNAL',
 TRUE,
 '2026-01-07 15:18:14.776+05:30',
 '2026-01-07 15:18:14.776+05:30'),

-- 2) Jaideep Deshpande
('a018989c-aa8d-42c0-b46f-49704fbd8300',
 'Jaideep Deshpande',
 'jaideep.deshpande@lockton.com',
 '9113523800',
 '2026-10-01 05:30:00+05:30',
 NULL,
 NULL,
 '3083557b-522b-4423-ab86-55b925ad8609',
 '0ec67c24-ef1d-43c6-9be3-1b369e99d1cd',
 'INTERNAL',
 TRUE,
 '2026-01-07 15:17:49.469+05:30',
 '2026-01-07 15:17:49.469+05:30'),

-- 3) Anil Mehta
('622e00f8-6c12-4e08-afe5-48125aa3d4f1',
 'Anil Mehta',
 'anil.mehta@kansai.com',
 '9114523400',
 '2026-10-01 05:30:00+05:30',
 'Jaideep Despande',
 'Mukul Bhatia',
 '14b2aca0-2c6a-4d8b-87d6-0b98c2e0ab76',
 '09a648c4-d17a-4476-91ce-f17356268175',
 'EXTERNAL',
 TRUE,
 '2026-01-07 15:17:16.405+05:30',
 '2026-01-08 13:51:19.858+05:30'),

-- 4) Mukul Bhatia
('f0b5f062-d71c-4d9b-a978-66240644ebaf',
 'Mukul Bhatia',
 'mukul.bhatia@lockton.com',
 '9114523800',
 '2026-10-01 05:30:00+05:30',
 NULL,
 NULL,
 '5e94e753-16ad-48e0-a889-667ae637ba51',
 '0ec67c24-ef1d-43c6-9be3-1b369e99d1cd',
 'INTERNAL',
 TRUE,
 '2026-01-07 15:19:33.688+05:30',
 '2026-01-08 13:53:25.019+05:30'),

-- 5) Himanshu Desai
('5263a237-d5a8-465b-a735-64c857abe48e',
 'Himanshu Desai',
 'himanshu.desai@lockton.com',
 '9114523860',
 '2026-10-01 05:30:00+05:30',
 NULL,
 NULL,
 '8eefeb8a-7eca-4b3e-9c90-5241edf1b68c',
 '0ec67c24-ef1d-43c6-9be3-1b369e99d1cd',
 'INTERNAL',
 TRUE,
 '2026-01-09 13:07:33.082+05:30',
 '2026-01-09 13:07:33.082+05:30');



INSERT INTO role_access_rights (id, role_type, access_right_id, created_at, updated_at)
VALUES
('b4451cf0-0662-402b-9455-5866cc999374', 'BUSINESS', '0252d1e4-8f1a-4d43-86c7-bfc681db21e9', '2026-01-07 16:45:55.429835+05:30', '2026-01-07 16:45:55.429835+05:30'),
('49aab619-8acd-4077-9d87-a80ac7e91acd', 'BUSINESS', '4bffe94f-88de-4305-92b0-8bc5eebbc864', '2026-01-07 16:45:55.429835+05:30', '2026-01-07 16:45:55.429835+05:30'),
('2319b7ee-1f52-4794-ae43-fc4c719b9887', 'BUSINESS', '76fd80fa-0c51-407b-8356-4514168f52b6', '2026-01-07 16:45:55.429835+05:30', '2026-01-07 16:45:55.429835+05:30'),
('8889c517-b6cc-47c0-8c80-a0ca18047461', 'BUSINESS', 'ba96b89c-cb9a-4569-b399-da9da6281575', '2026-01-07 16:45:55.429835+05:30', '2026-01-07 16:45:55.429835+05:30'),
('3d67baee-6a77-4910-8154-338dbbdd82ca', 'BUSINESS', 'd3b9ddc7-9853-4afb-8b28-033676f0f892', '2026-01-07 16:45:55.429835+05:30', '2026-01-07 16:45:55.429835+05:30'),
('a2a30a88-fc25-444b-b152-d678c85ed5a9', 'BUSINESS', 'e92c38ef-9879-47d4-b084-fe6d2c3b98ed', '2026-01-07 16:45:55.429835+05:30', '2026-01-07 16:45:55.429835+05:30'),
('744462e0-dcf5-4e18-ba6f-466252d2b6d5', 'BUSINESS', 'b8cec1fe-8396-4ccc-a520-90b8939f4c99', '2026-01-07 16:45:55.429835+05:30', '2026-01-07 16:45:55.429835+05:30'),
('6440405e-22f4-40db-9102-25270908c435', 'BUSINESS', '138b879c-dec0-4f2b-aa56-7f102cd52145', '2026-01-07 16:45:55.429835+05:30', '2026-01-07 16:45:55.429835+05:30'),
('505eef8d-9d79-42ce-9396-94c15749f7d5', 'BUSINESS', '354ba91a-2e5d-47e1-82e5-cc0a080cc435', '2026-01-07 16:45:55.429835+05:30', '2026-01-07 16:45:55.429835+05:30'),
('006d0192-c58f-4e0d-b6f6-85ec6a6c865a', 'BUSINESS', '1e143b5a-5ad7-4098-a94d-2ad19e68b6d7', '2026-01-07 16:45:55.429835+05:30', '2026-01-07 16:45:55.429835+05:30'),
('5233ca72-a730-4ac9-8410-d8b486ea28b9', 'BUSINESS', 'e28362d8-80b3-4be8-820f-136ab8846877', '2026-01-07 16:45:55.429835+05:30', '2026-01-07 16:45:55.429835+05:30'),
('2e6defa2-0afd-45f0-8e9f-7401d22a17dc', 'BUSINESS', '15c5db8c-5562-45a9-9924-f6fa8b82d842', '2026-01-07 16:45:55.429835+05:30', '2026-01-07 16:45:55.429835+05:30'),
('f236775b-aa50-4cdc-adbd-dc4de4a2ba6f', 'IT', '15c5db8c-5562-45a9-9924-f6fa8b82d842', '2026-01-07 16:46:46.214239+05:30', '2026-01-07 16:46:46.214239+05:30'),
('e0394420-49ef-400f-b8e7-cbf6f221909f', 'EXTERNAL', '4bffe94f-88de-4305-92b0-8bc5eebbc864', '2026-01-07 16:46:46.214239+05:30', '2026-01-07 16:46:46.214239+05:30'),
('2ca2d2d3-9f6d-4002-aeb9-03df8ebffcae', 'EXTERNAL', '76fd80fa-0c51-407b-8356-4514168f52b6', '2026-01-07 16:46:46.214239+05:30', '2026-01-07 16:46:46.214239+05:30'),
('2522b912-0ec1-4939-aa82-c8cd0135e2de', 'EXTERNAL', 'ba96b89c-cb9a-4569-b399-da9da6281575', '2026-01-07 16:46:46.214239+05:30', '2026-01-07 16:46:46.214239+05:30'),
('52806791-5934-402a-865b-e4cc7d2dd323', 'EXTERNAL', 'd3b9ddc7-9853-4afb-8b28-033676f0f892', '2026-01-07 16:46:46.214239+05:30', '2026-01-07 16:46:46.214239+05:30'),
('9780f3d3-1368-4aa4-bedb-c86f7a99cd3f', 'EXTERNAL', 'e92c38ef-9879-47d4-b084-fe6d2c3b98ed', '2026-01-07 16:46:46.214239+05:30', '2026-01-07 16:46:46.214239+05:30'),
('aae1b044-b4bc-478d-8c4f-9281d0c1a669', 'EXTERNAL', 'b8cec1fe-8396-4ccc-a520-90b8939f4c99', '2026-01-07 16:46:46.214239+05:30', '2026-01-07 16:46:46.214239+05:30'),
('a9ff504c-9896-4a26-8d88-9b840eb6ddf1', 'EXTERNAL', '138b879c-dec0-4f2b-aa56-7f102cd52145', '2026-01-07 16:46:46.214239+05:30', '2026-01-07 16:46:46.214239+05:30'),
('35114c2f-4204-4876-9506-33a34e7cb15d', 'EXTERNAL', '354ba91a-2e5d-47e1-82e5-cc0a080cc435', '2026-01-07 16:46:46.214239+05:30', '2026-01-07 16:46:46.214239+05:30'),
('38c277e3-f03b-4157-95cf-ae018d21377f', 'EXTERNAL', '1e143b5a-5ad7-4098-a94d-2ad19e68b6d7', '2026-01-07 16:46:46.214239+05:30', '2026-01-07 16:46:46.214239+05:30'),
('cb94cb16-7985-43ee-a27d-d97a93666e10', 'EXTERNAL', 'e28362d8-80b3-4be8-820f-136ab8846877', '2026-01-07 16:46:46.214239+05:30', '2026-01-07 16:46:46.214239+05:30'),
('bd190a28-d3e2-4cb9-9a8f-7653c1b055d6', 'IT', 'e92c38ef-9879-47d4-b084-fe6d2c3b98ed', '2026-01-07 17:04:09.307991+05:30', '2026-01-07 17:04:09.307991+05:30'),
('49034b45-c246-4595-adfd-55a3e45fd521', 'IT', 'b8cec1fe-8396-4ccc-a520-90b8939f4c99', '2026-01-07 17:04:09.307991+05:30', '2026-01-07 17:04:09.307991+05:30'),
('8544e436-cb93-44fd-815c-252e32c74048', 'IT', '354ba91a-2e5d-47e1-82e5-cc0a080cc435', '2026-01-07 17:04:09.307991+05:30', '2026-01-07 17:04:09.307991+05:30');
``



INSERT INTO access_rights (id, right_name, description, code, created_at, updated_at)
VALUES
('0252d1e4-8f1a-4d43-86c7-bfc681db21e9', 'Select All', 'Full access to all modules', 'SELECT_ALL', '2025-12-17T03:30:22.731Z', '2025-12-17T03:30:22.731Z'),
('4bffe94f-88de-4305-92b0-8bc5eebbc864', 'Policies', 'Access to policies module', 'POLICIES', '2025-12-17T03:30:22.731Z', '2025-12-17T03:30:22.731Z'),
('76fd80fa-0c51-407b-8356-4514168f52b6', 'Claims', 'Access to claims module', 'CLAIMS', '2025-12-17T03:30:22.731Z', '2025-12-17T03:30:22.731Z'),
('ba96b89c-cb9a-4569-b399-da9da6281575', 'Renewals', 'Access to renewals module', 'RENEWALS', '2025-12-17T03:30:22.731Z', '2025-12-17T03:30:22.731Z'),
('d3b9ddc7-9853-4afb-8b28-033676f0f892', 'Reports & Analytics', 'Access to reports & analytics', 'REPORTS_AND_ANALYTICS', '2025-12-17T03:30:22.731Z', '2025-12-17T03:30:22.731Z'),
('e92c38ef-9879-47d4-b084-fe6d2c3b98ed', 'Products & Services', 'Access to products and services', 'PRODUCTS_AND_SERVICES', '2025-12-17T03:30:22.731Z', '2025-12-17T03:30:22.731Z'),
('b8cec1fe-8396-4ccc-a520-90b8939f4c99', 'News & Insights', 'Access to news and insights', 'NEWS_AND_INSIGHTS', '2025-12-17T03:30:22.731Z', '2025-12-17T03:30:22.731Z'),
('138b879c-dec0-4f2b-aa56-7f102cd52145', 'Declarations', 'Access to declarations module', 'DECLARATIONS', '2025-12-17T03:30:22.731Z', '2025-12-17T03:30:22.731Z'),
('354ba91a-2e5d-47e1-82e5-cc0a080cc435', 'FAQs', 'Access to FAQs', 'FAQS', '2025-12-17T03:30:22.731Z', '2025-12-17T03:30:22.731Z'),
('1e143b5a-5ad7-4098-a94d-2ad19e68b6d7', 'Downloading', 'Access to downloads page', 'DOWNLOADING', '2025-12-17T03:30:22.731Z', '2025-12-17T03:30:22.731Z'),
('e28362d8-80b3-4be8-820f-136ab8846877', 'Dashboard', 'Access to Dasboard page', 'DASHBOARD', '2025-12-17T03:30:22.731Z', '2025-12-17T03:30:22.731Z'),
('15c5db8c-5562-45a9-9924-f6fa8b82d842', 'Manage Users', 'Access to Manage Users page', 'MANAGE_USERS', '2025-12-17T03:30:22.731Z', '2025-12-17T03:30:22.731Z');
``
