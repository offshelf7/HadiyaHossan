-- Role column is already added in previous migration

-- Create function to set admin role
CREATE OR REPLACE FUNCTION set_admin_role(user_id_param UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE users
  SET role = 'admin'
  WHERE id = user_id_param;
END;
$$ LANGUAGE plpgsql;

-- Create function to set reporter role
CREATE OR REPLACE FUNCTION set_reporter_role(user_id_param UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE users
  SET role = 'reporter'
  WHERE id = user_id_param;
END;
$$ LANGUAGE plpgsql;

-- Create function to set salesperson role
CREATE OR REPLACE FUNCTION set_salesperson_role(user_id_param UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE users
  SET role = 'salesperson'
  WHERE id = user_id_param;
END;
$$ LANGUAGE plpgsql;

-- Create function to reset to user role
CREATE OR REPLACE FUNCTION set_user_role(user_id_param UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE users
  SET role = 'user'
  WHERE id = user_id_param;
END;
$$ LANGUAGE plpgsql;
