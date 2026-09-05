INSERT INTO roles (name, description)
VALUES
    (
        'ADMIN',
        'Full system administration access'
    ),
    (
        'HR_MANAGER',
        'HR management access'
    ),
    (
        'HR_PAYROLL_USER',
        'HR and payroll operational access'
    ),
    (
        'HR_PAYROLL_MANAGER',
        'Full HR and payroll management access'
    ),
    (
        'EMPLOYEE',
        'Employee self-service access'
    )
ON CONFLICT (name) DO NOTHING;